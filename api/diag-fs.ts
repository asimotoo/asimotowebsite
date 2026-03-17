import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const results: any = {
    cwd: process.cwd(),
    dirname: __dirname,
    files_in_cwd: [],
    files_in_var_task: [],
    files_in_server: []
  };

  try {
    results.files_in_cwd = fs.readdirSync(process.cwd());
  } catch (e: any) { results.error_cwd = e.message; }

  try {
    results.files_in_var_task = fs.readdirSync('/var/task');
  } catch (e: any) { results.error_var_task = e.message; }

  try {
    const serverPath = path.join(process.cwd(), 'server');
    if (fs.existsSync(serverPath)) {
      results.files_in_server = fs.readdirSync(serverPath);
    } else {
      results.server_exists = false;
    }
  } catch (e: any) { results.error_server = e.message; }

  res.status(200).json(results);
}
