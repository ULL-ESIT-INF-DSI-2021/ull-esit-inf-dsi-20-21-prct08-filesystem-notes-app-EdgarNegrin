import * as yargs from 'yargs';
import {Notes} from './notes';

const notes: Notes = Notes.getNotes();

/**
 * Comando add
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body text',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color´s note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.color === 'string' && typeof argv.body === 'string') {
      notes.addNotes(argv.user, argv.title, argv.body, argv.color);
    }
  },
});

/**
 * Comando show
 */
yargs.command({
  command: 'show',
  describe: 'Show note of a user by a title',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      notes.showNote(argv.user, argv.title);
    }
  },
});

/**
 * Comando list
 */
yargs.command({
  command: 'list',
  describe: 'Show notes of a user',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      notes.showNotes(argv.user);
    }
  },
});

/**
 * Comando remove
 */
yargs.command({
  command: 'remove',
  describe: 'Remove note of a user by a title',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      notes.removeNote(argv.user, argv.title);
    }
  },
});

yargs.parse();
