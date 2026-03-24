@description('Azure Container Registry name')
param acrName string

@description('Principal ID of the API Web App managed identity')
param apiPrincipalId string

@description('Principal ID of the Frontend Web App managed identity')
param frontendPrincipalId string

// AcrPull built-in role definition ID
var acrPullRoleDefinitionId = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '7f951dda-4ed3-4680-a7ca-43fe172d538d'
)

// Reference existing ACR in this resource group
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: acrName
}

// AcrPull role assignment for API Web App managed identity
resource apiAcrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, apiPrincipalId, 'AcrPull')
  scope: acr
  properties: {
    roleDefinitionId: acrPullRoleDefinitionId
    principalId: apiPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// AcrPull role assignment for Frontend Web App managed identity
resource frontendAcrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, frontendPrincipalId, 'AcrPull')
  scope: acr
  properties: {
    roleDefinitionId: acrPullRoleDefinitionId
    principalId: frontendPrincipalId
    principalType: 'ServicePrincipal'
  }
}
