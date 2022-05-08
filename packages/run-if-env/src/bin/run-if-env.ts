#!/usr/bin/env node

import process from 'node:process';
import qs from 'qs';
import { execaCommandSync } from 'execa';

const args = process.argv.slice(2);

const scriptStartIndex = args.findIndex((arg) => !arg.includes('='));

if (scriptStartIndex === -1) {
	throw new Error('No script specified.');
}

const conditions = args.slice(0, scriptStartIndex);
const script = args.slice(scriptStartIndex).join(' ');

const query = conditions.join('&');
const expected = qs.parse(query);

for (const env in expected) {
	if (process.env[env] !== expected[env]) {
		console.info(
			`run-if-env: Skipped running \`${script}\` because ${env} was equal to ${expected[env]}`
		);
		process.exit(0);
	}
}

execaCommandSync(script, { shell: true, stdio: 'inherit' });
