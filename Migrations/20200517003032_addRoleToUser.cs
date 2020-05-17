using Microsoft.EntityFrameworkCore.Migrations;

namespace A.Migrations
{
    public partial class addRoleToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserID_UserIDid",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "UserIDid",
                table: "AspNetUsers",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserID_UserIDid",
                table: "AspNetUsers",
                column: "UserIDid",
                principalTable: "UserID",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserID_UserIDid",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "UserIDid",
                table: "AspNetUsers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserID_UserIDid",
                table: "AspNetUsers",
                column: "UserIDid",
                principalTable: "UserID",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
