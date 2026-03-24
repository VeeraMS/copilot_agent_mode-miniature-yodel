@description('Azure region for the Log Analytics workspace')
param location string

@description('Environment name used for resource naming')
param environmentName string

var workspaceName = 'log-${environmentName}-${uniqueString(resourceGroup().id)}'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

output workspaceId string = logAnalyticsWorkspace.id
