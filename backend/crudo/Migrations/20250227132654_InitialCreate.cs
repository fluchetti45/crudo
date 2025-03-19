using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crudo.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Cart__3213E83F10717185", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__3213E83F2A36064B", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatus",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderStatus__3213E83F8C005E2F", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingData",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    address = table.Column<string>(type: "text", nullable: false),
                    city = table.Column<string>(type: "text", nullable: false),
                    country = table.Column<string>(type: "text", nullable: false),
                    postal_code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Shipping__3213E83FDCE33202", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    category_id = table.Column<int>(type: "int", nullable: true),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    stock = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Product__3213E83F3FFEA4AB", x => x.id);
                    table.ForeignKey(
                        name: "FK__Product__categor__398D8EEE",
                        column: x => x.category_id,
                        principalTable: "Category",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "CustomerOrder",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    status_id = table.Column<int>(type: "int", nullable: false),
                    total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    id_shipping_data = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__3213E83F8C005E2F", x => x.id);
                    table.ForeignKey(
                        name: "FK__CustomerO__id_sh__46E78A0C",
                        column: x => x.id_shipping_data,
                        principalTable: "ShippingData",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__CustomerO__status_id__46E78A0D",
                        column: x => x.status_id,
                        principalTable: "OrderStatus",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "CartItem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cart_id = table.Column<int>(type: "int", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CartItem__3213E83F208932A5", x => x.id);
                    table.ForeignKey(
                        name: "FK__CartItem__cart_i__412EB0B6",
                        column: x => x.cart_id,
                        principalTable: "Cart",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__CartItem__produc__4222D4EF",
                        column: x => x.product_id,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "ProductImage",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    is_cover = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    file_path = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ProductI__3213E83FBF349574", x => x.id);
                    table.ForeignKey(
                        name: "FK__ProductIm__produ__3C69FB99",
                        column: x => x.product_id,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    order_id = table.Column<int>(type: "int", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__3213E83F0A04B94A", x => x.id);
                    table.ForeignKey(
                        name: "FK__OrderItem__order__49C3F6B7",
                        column: x => x.order_id,
                        principalTable: "CustomerOrder",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__OrderItem__produ__4AB81AF0",
                        column: x => x.product_id,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItem_cart_id",
                table: "CartItem",
                column: "cart_id");

            migrationBuilder.CreateIndex(
                name: "IX_CartItem_product_id",
                table: "CartItem",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerOrder_id_shipping_data",
                table: "CustomerOrder",
                column: "id_shipping_data");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerOrder_status_id",
                table: "CustomerOrder",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_order_id",
                table: "OrderItem",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_product_id",
                table: "OrderItem",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_category_id",
                table: "Product",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_product_id",
                table: "ProductImage",
                column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItem");

            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "ProductImage");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "CustomerOrder");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "ShippingData");

            migrationBuilder.DropTable(
                name: "OrderStatus");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
