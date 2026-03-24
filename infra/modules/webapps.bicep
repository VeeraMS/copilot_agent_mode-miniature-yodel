@description('Azure region for all resources')
param location string

@description('Base application name')
param appName string

@description('Azure Container Registry name')
param acrName string

@description('Docker image tag')
param imageTag string

@description('Log Analytics workspace resource ID')
param logAnalyticsWorkspaceId string

// Unique suffix to avoid naming collisions
var uniqueSuffix = uniqueString(resourceGroup().id)
var apiWebAppName = '${appName}-api-${uniqueSuffix}'
var frontendWebAppName = '${appName}-web-${uniqueSuffix}'
var appServicePlanName = '${appName}-plan-${uniqueSuffix}'
var acrLoginServer = '${acrName}.azurecr.io'

// Compute FQDNs upfront to avoid circular dependencies between API and Frontend
var apiHostName = '${apiWebAppName}.azurewebsites.net'
var frontendHostName = '${frontendWebAppName}.azurewebsites.net'

// Shared App Service Plan (Linux, B1 SKU)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  properties: {
    reserved: true
  }
  sku: {
    name: 'B1'
  }
}

// API Web App
resource apiWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiWebAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acrLoginServer}/${appName}-api:${imageTag}'
      acrUseManagedIdentityCreds: true
      appSettings: [
        {
          name: 'API_CORS_ORIGINS'
          value: 'https://${frontendHostName}'
        }
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
    }
  }
}

// Frontend Web App
resource frontendWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: frontendWebAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acrLoginServer}/${appName}-frontend:${imageTag}'
      acrUseManagedIdentityCreds: true
      appSettings: [
        {
          name: 'API_HOST'
          value: apiHostName
        }
        {
          name: 'API_PORT'
          value: '80'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
    }
  }
}

// Diagnostic settings for API Web App
resource apiDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'api-diagnostics'
  scope: apiWebApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

// Diagnostic settings for Frontend Web App
resource frontendDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'frontend-diagnostics'
  scope: frontendWebApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

output apiHostName string = apiWebApp.properties.defaultHostName
output frontendHostName string = frontendWebApp.properties.defaultHostName
output apiPrincipalId string = apiWebApp.identity.principalId
output frontendPrincipalId string = frontendWebApp.identity.principalId
