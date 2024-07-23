using Calendaurus.Models;
using Calendaurus.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Enabled OAuth security in Swagger
    c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
    {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
                Type = ReferenceType.SecurityScheme,
                Id = "oauth2"
            },
            Scheme = "oauth2",
            Name = "oauth2",
            In = ParameterLocation.Header
        },
        new List <string> ()
    }
    });
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow()
            {
                AuthorizationUrl = new Uri("https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize"),
                TokenUrl = new Uri("https://login.microsoftonline.com/consumers/oauth2/v2.0/token"),
            }
        }
    });
});

builder.Services.AddTransient<IRepository<CalendarEntry>, CalendarEntryEfRepository>();
builder.Services.AddTransient<ICalendarService<CalendarEntry>, CalendarService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddDbContext<CalendaurusContext>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options =>
    {
        builder.Configuration.Bind("AzureAd", options);
        options.TokenValidationParameters.NameClaimType = "preferred_username";
    },
    options => builder.Configuration.Bind("AzureAd", options));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.OAuthAppName("Swagger Client");
        options.OAuthClientId(builder.Configuration.GetValue<string>("AzureAd:ClientId"));
        options.OAuthScopes("openid", "email", "api://be8fb141-1de4-47e6-b6eb-83b069827245/Calendaurus.API");
        options.OAuthClientSecret(builder.Configuration.GetValue<string>("AzureAd:Secret"));
        options.OAuthUseBasicAuthenticationWithAccessCodeGrant();
    });
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
