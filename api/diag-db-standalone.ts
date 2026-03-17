import pg from 'pg';

export default async function handler(req: any, res: any) {
  const DB_URL = "postgresql://postgres.pmlgesmbfqwdutfwizam:asi20moto26@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    results.tests.poolInit = "START";
    const pool = new pg.Pool({
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    results.tests.poolInit = "SUCCESS";
    
    try {
      results.tests.query = "STARTING (5s timeout)";
      const dbRes = await pool.query("SELECT NOW() as now");
      results.tests.query = "SUCCESS";
      results.dbTime = dbRes.rows[0].now;
    } catch (queryErr: any) {
      results.tests.query = "FAILED";
      results.queryError = queryErr.message;
    } finally {
      await pool.end();
    }
  } catch (initErr: any) {
    results.tests.poolInit = "FAILED";
    results.initError = initErr.message;
  }

  res.status(200).json(results);
}
