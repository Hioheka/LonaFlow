# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/BudgetTracker.API/BudgetTracker.API.csproj", "src/BudgetTracker.API/"]
COPY ["src/BudgetTracker.Core/BudgetTracker.Core.csproj", "src/BudgetTracker.Core/"]
COPY ["src/BudgetTracker.Data/BudgetTracker.Data.csproj", "src/BudgetTracker.Data/"]
COPY ["src/BudgetTracker.Services/BudgetTracker.Services.csproj", "src/BudgetTracker.Services/"]

RUN dotnet restore "src/BudgetTracker.API/BudgetTracker.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/BudgetTracker.API"
RUN dotnet build "BudgetTracker.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "BudgetTracker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BudgetTracker.API.dll"]
