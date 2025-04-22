import { Access, CollectionBeforeChangeHook } from 'payload/types';


// when set on read permission filters all payload.find() and payload.findById()
export const tenantAccessFilterQuery: Access = ({ req }) => {
  return {
    tenant: {
      equals: req.headers.host,
    }
  }
}

export const setTenantOnCreate: CollectionBeforeChangeHook =
  ({ data, req, operation, originalDoc }) => {
    if (operation === "create") {
      data["tenant"] = req.headers.host;
      return data;
    }
    return originalDoc;
  }

