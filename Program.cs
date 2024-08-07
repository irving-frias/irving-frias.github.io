using BlazorStatic;
using IrvingFrias.Components;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseStaticWebAssets();

builder.Services.AddBlazorStaticService(opt =>
{
    opt.IgnoredPathsOnContentCopy.Add("app.css");//pre-build version for tailwind
}
).AddBlazorStaticContentService<BlogFrontMatter>();

builder.Services.AddRazorComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>();

app.UseBlazorStaticGenerator(shutdownApp: !app.Environment.IsDevelopment());

app.Run();

public static class WebsiteKeys
{
    public const string GitHubRepo = "https://github.com/irving-frias/irving-frias.github.io";
    public const string X = "https://x.com/irvingfrias41";
    public const string Title = "Irving Frias Blog";
    public const string BlogPostStorageAddress = $"{GitHubRepo}/tree/master/Content/Blog";
    public const string BlogLead = "Blog";

}
