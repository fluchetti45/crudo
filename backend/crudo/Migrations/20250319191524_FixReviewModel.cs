using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crudo.Migrations
{
    /// <inheritdoc />
    public partial class FixReviewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePathCover",
                table: "CustomerReview");

            migrationBuilder.DropColumn(
                name: "ProductName",
                table: "CustomerReview");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilePathCover",
                table: "CustomerReview",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                table: "CustomerReview",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
