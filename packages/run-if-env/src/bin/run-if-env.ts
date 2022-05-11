#!/usr/bin/env node

import { execaCommandSync } from 'execa';
import process from 'node:process';

const args = process.argv.slice(2);

const scriptStartIndex = args.findIndex((arg) => !arg.includes('='));

if (scriptStartIndex === -1) {
	throw new Error('No script specified.');
}

const conditions = args.slice(0, scriptStartIndex);
const script = args.slice(scriptStartIndex).join(' ');

function skipRun(reason: string) {
	console.info(`run-if-env: Skipped running \`${script}\` ${reason}`);
	process.exit(0);
}

for (const condition of conditions) {
	if (condition.includes('!=')) {
		const [key, expectedValue] = condition.split('!=');
		if (process.env[key!] === expectedValue) {
			skipRun(`because ${key!} was equal to ${expectedValue!}`);
		}
	} else if (condition.includes('=')) {
		const [key, expectedValue] = condition.split('=');
		if (process.env[key!] !== expectedValue) {
			skipRun(`because ${key!} was equal to ${expectedValue!}`);
		}
	}
}

execaCommandSync(script, { shell: true, stdio: 'inherit' });
