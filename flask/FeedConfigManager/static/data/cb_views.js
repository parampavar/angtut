
// NAME: Tenant|1|CUSTOMER
// DESCRIPTION: This view shows all documents of CUSTOMER for tenant 1
function (doc, meta) {
  if ( doc.tenantid == 1 && doc.feedtype == 'CUSTOMER')
  	emit(meta.id, doc);
}

// NAME: Tenant|1|CUSTOMER|REJECTED
// DESCRIPTION: This view shows all documents of CUSTOMER for tenant 1 that are rejected
function (doc, meta) {
  if ( doc.tenantid == 1 && doc.feedtype == 'CUSTOMER' && (doc.errorflag == 1 || doc.rejectedflag == 1))
  	emit(meta.id, doc);
}
