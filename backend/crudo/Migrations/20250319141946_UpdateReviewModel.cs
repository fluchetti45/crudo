using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crudo.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReviewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilePathCover",
                table: "CustomerReview",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePathCover",
                table: "CustomerReview");
        }
    }
}
