using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calendaurus.Models.Migrations
{
    /// <inheritdoc />
    public partial class Users : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "CalendarEntries",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEntries_UserId",
                table: "CalendarEntries",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalendarEntries_User_UserId",
                table: "CalendarEntries",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalendarEntries_User_UserId",
                table: "CalendarEntries");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_CalendarEntries_UserId",
                table: "CalendarEntries");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CalendarEntries");
        }
    }
}
