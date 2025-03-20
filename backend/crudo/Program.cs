using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.OpenApi.Models;
using Crudo.Services;


// Cargar variables de entorno desde el archivo .env
try
{
    // En el contenedor, el archivo estará en /app/.env
    var envPath = File.Exists("/app/.env") ? "/app/.env" :
                  File.Exists(".env") ? ".env" :
                  "../../.env";

    DotNetEnv.Env.Load(envPath);
}
catch (Exception e)
{
    Console.WriteLine($"Warning: No se pudo cargar el archivo .env: {e.Message}");
    // Continuamos la ejecución ya que las variables pueden estar definidas en el ambiente
}

var builder = WebApplication.CreateBuilder(args);

// DBContext
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
    builder.Configuration.GetConnectionString("DefaultConnection") ??
    throw new InvalidOperationException("Connection string not found.");

builder.Services.AddDbContext<CrudoContext>(options =>
{
    options.UseSqlServer(connectionString, sqlServerOptions =>
    {
        sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
});

// JWT
var domain = Environment.GetEnvironmentVariable("AUTH0_DOMAIN");
var audience = Environment.GetEnvironmentVariable("AUTH0_AUDIENCE");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = $"https://{domain}/";
    options.Audience = audience;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = "https://crudo.com/claims/roles"
    };
});

// Policy admin only
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("https://crudo.com/claims/roles", "Admin"));
});

// Policy admin owner
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOrOwner", policy =>
    {
        policy.RequireAssertion(context =>
        {
            var isAdmin = context.User.HasClaim(c => c.Type == "https://crudo.com/claims/roles" && c.Value == "Admin");
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // El orderId lo obtenemos de la ruta
            var orderId = context.Resource as int?;

            // Permite acceso si el usuario es admin o el dueño de la orden (verificado por userId en la ruta)
            if (isAdmin || (orderId.HasValue && userId == orderId.Value.ToString()))
            {
                return true;
            }

            return false;
        });
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAny", configurePolicy: policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://localhost:80",
                "http://localhost:5075",
                "http://localhost",
                "http://127.0.0.1",
                "http://127.0.0.1:80",
                "http://127.0.0.1:4200",
                "https://fluchetti.xyz",
                "https://www.fluchetti.xyz",
                "https://api.fluchetti.xyz"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();

// Configuración de Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Crudo API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Servicios
builder.Services.AddScoped<CategoryServices>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<CustomerReviewService>();
builder.Services.AddScoped<ProductServices>();
builder.Services.AddScoped<ProductImageServices>();
builder.Services.AddScoped<CartServices>();
builder.Services.AddScoped<OrderServices>();
builder.Services.AddScoped<StatusServices>();
builder.Services.AddScoped<EmailServices>();
builder.Services.AddScoped<ShippingDataServices>();
builder.Services.AddScoped<MailgunService>();
builder.Services.AddScoped<WishlistService>();


var app = builder.Build();

// Aplicar migraciones y esperar a que SQL Server esté disponible
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<CrudoContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();
    var retryCount = 0;
    const int maxRetries = 10;

    while (retryCount < maxRetries)
    {
        try
        {
            logger.LogInformation("Intentando conectar a la base de datos...");

            // Aplicar migraciones (esto creará las tablas si no existen)
            context.Database.Migrate();

            // Seed data
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category
                    {
                        Name = "Electrodomésticos",
                        Description = "Electrodomésticos para el hogar, ideales para facilitar tus tareas diarias. Encuentra una amplia gama de productos como neveras, lavadoras, microondas, aspiradoras y más, todos diseñados para mejorar tu calidad de vida con tecnología avanzada y eficiencia energética.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Category
                    {
                        Name = "Sillas",
                        Description = "Colección de sillas cómodas y de diseño variado, perfectas para cualquier espacio en tu hogar o oficina. Disponemos de sillas ergonómicas, sillas de comedor, sillas de escritorio y mucho más, en distintos materiales y estilos que se adaptan a tus necesidades de confort y estética.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Category
                    {
                        Name = "Mesas",
                        Description = "Mesas para todos los gustos y espacios. Desde mesas de comedor, mesas de centro, mesas de trabajo hasta mesas auxiliares, nuestras opciones combinan funcionalidad y diseño. Disponibles en diversos materiales como madera, vidrio y metal, para que encuentres la mesa perfecta que se adapte a tu estilo y necesidades.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Category
                    {
                        Name = "Muebles",
                        Description = "Muebles de alta calidad para decorar y organizar tu hogar de forma práctica y elegante. Aquí encontrarás muebles para todas las habitaciones: sofás, estanterías, camas, cómodas, y más, fabricados con materiales duraderos y diseños modernos para optimizar tu espacio sin sacrificar estilo.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Category
                    {
                        Name = "Sillones",
                        Description = "Sillones y butacas de lujo que ofrecen comodidad superior para tu salón o sala de estar. Disponibles en una variedad de tamaños, estilos y tapizados, nuestros sillones brindan una experiencia de descanso inigualable, desde modelos clásicos hasta opciones más contemporáneas para todos los gustos y presupuestos.",
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    }
                );
                context.OrderStatuses.AddRange(
                    new OrderStatus { Name = "Pending" },
                    new OrderStatus { Name = "Completed" },
                    new OrderStatus { Name = "Shipped" },
                    new OrderStatus { Name = "Delivered" },
                    new OrderStatus { Name = "Paid" },
                    new OrderStatus { Name = "Refunded" }
                );
                context.SaveChanges();
                logger.LogInformation("Datos de prueba insertados correctamente");
            }
            else
            {
                logger.LogInformation("Datos de prueba ya existen");
            }

            logger.LogInformation("Base de datos actualizada correctamente");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogError(ex, "Error al conectar con la base de datos. Intento {RetryCount} de {MaxRetries}", retryCount, maxRetries);
            if (retryCount < maxRetries)
            {
                logger.LogInformation("Esperando 5 segundos antes de reintentar...");
                Thread.Sleep(5000);
            }
            else
            {
                logger.LogError("No se pudo conectar a la base de datos después de {MaxRetries} intentos", maxRetries);
                throw;
            }
        }
    }
}

// Habilitar Swagger en todos los ambientes
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Crudo API V1");
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAny");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
