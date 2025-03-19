using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crudo.Migrations
{
    /// <inheritdoc />
    public partial class AddUserReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerReview",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CustomerReview__3213E83F8C005E2F", x => x.id);
                    table.ForeignKey(
                        name: "FK__CustomerR__produ__49C3F6B7",
                        column: x => x.product_id,
                        principalTable: "Product",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReview_product_id",
                table: "CustomerReview",
                column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerReview");
        }
    }
}
