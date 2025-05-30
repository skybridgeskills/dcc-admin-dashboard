import { Access, CollectionBeforeChangeHook } from 'payload/types';


// when set on read permission filters all payload.find() and payload.findById()
export const tenantAccessFilterQuery: Access = ({ req }) => {
  return {
    tenant: {
      equals: toTenant(req.headers.host),
    }
  }
}

export const setTenantOnCreate: CollectionBeforeChangeHook =
  ({ data, req, operation }) => {
    if (operation === "create" && !data["tenant"]) {
      data["tenant"] = toTenant(req.headers.host);
    }
    return data;
  }

export const toTenant = (host: string): string => host.replace(":", "-");

// Tenant is stored in aws as a secret so Must be a valid name containing alphanumeric characters, or any of the following: -/_+=.@!
