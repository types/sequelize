
export interface QueryTypes {
  SELECT: string // 'SELECT'
  INSERT: string // 'INSERT'
  UPDATE: string // 'UPDATE'
  BULKUPDATE: string // 'BULKUPDATE'
  BULKDELETE: string // 'BULKDELETE'
  DELETE: string // 'DELETE'
  UPSERT: string // 'UPSERT'
  VERSION: string // 'VERSION'
  SHOWTABLES: string // 'SHOWTABLES'
  SHOWINDEXES: string // 'SHOWINDEXES'
  DESCRIBE: string // 'DESCRIBE'
  RAW: string // 'RAW'
  FOREIGNKEYS: string // 'FOREIGNKEYS'
}
