using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crudo.Migrations
{
    /// <inheritdoc />
    public partial class updateProductModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Product__categor__398D8EEE",
                table: "Product");

            migrationBuilder.AlterColumn<int>(
                name: "category_id",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "Product",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK__Product__categor__398D8EEE",
                table: "Product",
                column: "category_id",
                principalTable: "Category",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Product__categor__398D8EEE",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "Product");

            migrationBuilder.AlterColumn<int>(
                name: "category_id",
                table: "Product",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK__Product__categor__398D8EEE",
                table: "Product",
                column: "category_id",
                principalTable: "Category",
                principalColumn: "id");
        }
    }
}
