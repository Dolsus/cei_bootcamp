using Microsoft.EntityFrameworkCore.Migrations;

namespace InvictusDashboard.Migrations
{
    public partial class Reset : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentTaskId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Difficulty = table.Column<int>(nullable: false),
                    Priority = table.Column<int>(nullable: false),
                    Completed = table.Column<bool>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    StartDate = table.Column<string>(nullable: true),
                    DueDate = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tasks");
        }
    }
}
