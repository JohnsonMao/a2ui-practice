#!/usr/bin/env node
import { Command } from 'commander'
import { addServeCommand } from './commands/serve.js'
import { addGenerateRefsCommand } from './commands/generate-refs.js'

const program = new Command()

program
  .name('a2ui')
  .description('A2UI CLI — serve the preview app and generate component skill references')
  .version('0.0.0')

addServeCommand(program)
addGenerateRefsCommand(program)

program.parseAsync(process.argv).then(() => {
  if (process.argv.length < 3) {
    program.outputHelp()
  }
})
