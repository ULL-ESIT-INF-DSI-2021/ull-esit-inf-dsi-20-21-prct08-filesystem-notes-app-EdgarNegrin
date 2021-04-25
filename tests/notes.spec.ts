import 'mocha';
import {expect} from 'chai';
import {Notes} from '../src/notes';
import * as fs from 'fs';

fs.rmdirSync('./notes', {recursive: true});

describe(('Tests de Notes'), () => {
  fs.rmSync('./notes', {
    recursive: true,
    force: true,
  })
  const notes: Notes = Notes.getNotes();
  it(('Directorio notes/ generado'), () => {
    expect(fs.existsSync('./notes')).to.be.equal(true);
  });

  it(('Se agregan notas'), () => {
    notes.addNotes('Edgar', 'compra', 'leche, huevos', 'yellow');
    expect(fs.existsSync('./notes/Edgar/compra')).to.be.equal(true);
  });

  it(('Se muestra una nota'), () => {
    const noteJson = notes.showNote('Edgar', 'compra');
    expect(noteJson).to.be.deep.equal(
        {
          'body': 'leche, huevos',
          'color': 'yellow',
          'title': 'compra',
        },
    );
  });

  it(('Se muestra la lista de notas'), () => {
    notes.addNotes('Edgar', 'juegos', 'fifa, csgo', 'blue');
    expect(notes.showNotes('Edgar')).to.be.equal('compra\njuegos\n');
  });

  it(('Se elimina una nota'), () => {
    notes.removeNote('Edgar', 'juegos');
    expect(fs.existsSync('./notes/Edgar/juegos')).to.be.equal(false);
  });

  it(('Se muestra una nota inexistente'), () => {
    expect(notes.showNote('Edgar', 'tareas')).to.be.equal(
        'Note not found',
    );
  });

  it(('Se muestran las notas de un usuario inexistente'), () => {
    expect(notes.showNotes('Juan')).to.be.equal('User not found');
  });

  it(('Se elimina una nota inexistente'), () => {
    expect(notes.removeNote('Edgar', 'tareas')).to.be.equal(
        'Note not found');
  });
});
