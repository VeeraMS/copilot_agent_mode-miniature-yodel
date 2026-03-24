targetScope = 'resourceGroup'

@description('Environment name (e.g., staging, production)')
param environmentName string

@description('Base application name')
param appName string

@description('Azure Container Registry name')
param acrName string

@description('Docker image tag')
param imageTag string

@description('Resource group containing the ACR (defaults to current resource group)')
param acrResourceGroup string = resourceGroup().name

@description('Azure region for all resources (defaults to resource group location)')
param location string = resourceGroup().location

// Deploy Log Analytics workspace
module logAnalytics './modules/logAnalytics.bicep' = {
  name: 'logAnalytics'
  params: {
    location: location
    environmentName: environmentName
  }
}

// Deploy Web Apps with ACR integration
module webApps './modules/webapps.bicep' = {
  name: 'webApps'
  params: {
    location: location
    appName: appName
    acrName: acrName
    acrResourceGroup: acrResourceGroup
    imageTag: imageTag
    logAnalyticsWorkspaceId: logAnalytics.outputs.workspaceId
  }
}

output apiUrl string = 'https://${webApps.outputs.apiHostName}'
output frontendUrl string = 'https://${webApps.outputs.frontendHostName}'
