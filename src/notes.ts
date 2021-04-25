import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * Clase Notes 
 */
export class Notes {
  private static notes: Notes;

  /**
   * Constructor
   */
  private constructor() {
  }

  /**
   * Getter de notes
   * @returns notas tipo Notes
   */
  public static getNotes(): Notes {
    if (!Notes.notes) {
      Notes.notes = new Notes();
    }
    if (!fs.existsSync('./notes')) {
      fs.mkdirSync('./notes', {recursive: true});
    }
    return Notes.notes;
  }

  /**
   * Muestra una nota del usuario por titulo
   * @param userName Nombre del usuario
   * @param title Titulo de la nota
   * @returns nota mostrada o string con error
   */
  public showNote(userName: string, title: string) {
    if (fs.existsSync(`./notes/${userName}/${title}`)) {
      const data = fs.readFileSync(`./notes/${userName}/${title}`);
      const noteJson = JSON.parse(data.toString());
      this.showWithColor(`${noteJson.title}`, noteJson.color);
      this.showWithColor(`${noteJson.body}`, noteJson.color);
      return noteJson;
    } else {
      this.showWithColor('Note not found', 'red')
      return 'Note not found'
    }
  }

  /**
   * Muestra las notas de un usuario
   * @param userName Nombre del usuario
   * @returns Notas encontradas
   */
  public showNotes(userName: string): string {
    if (fs.existsSync(`./notes/${userName}`)) {
      this.showWithColor('Your notes', 'green');
      let notes = '';
      fs.readdirSync(`./notes/${userName}/`).forEach((note) => {
        const data = fs.readFileSync(`./notes/${userName}/${note}`);
        const noteJson = JSON.parse(data.toString());
        notes = notes + noteJson.title + '\n';
        this.showWithColor(`${noteJson.title}`, noteJson.color);
      });
      return notes;
    } else {
      this.showWithColor('User not found', 'red');
      return 'User not found';
    }
  }

  /**
   * Añade una nota
   * @param userName Nombre de usuario
   * @param title Titulo de la nota
   * @param body Cuerpo de la nota
   * @param color Color del texto
   * @returns String con un aviso dependiendo del estado
   */
  public addNotes(userName: string, title: string, body: string, color: string): string {
    this.validColor(color);
    const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;
    if (fs.existsSync(`./notes/${userName}`)) {
      if (!fs.existsSync(`./notes/${userName}/${title}`)) {
        fs.writeFileSync(`./notes/${userName}/${title}`, note);
        this.showWithColor('New note added!', 'green');
        return 'New note added!';
      } else {
        this.showWithColor('Note title taken!', 'red');
        return 'Note title taken!';
      }
    } else {
      fs.mkdirSync(`./notes/${userName}`, {recursive: true});
      fs.writeFileSync(`./notes/${userName}/${title}`, note);
      this.showWithColor('New note added!', 'green');
      return 'New note added!'
    }
  }

  /**
   * Elimina una nota de un usuario por titulo
   * @param userName Nombre del usuario
   * @param title Titulo de la nota
   * @returns String con aviso dependiendo de estado
   */
  public removeNote(userName: string, title: string): string {
    if (fs.existsSync(`./notes/${userName}/${title}`)) {
      fs.rmSync(`./notes/${userName}/${title}`);
      this.showWithColor('Note removed!', 'green')
      return 'Note removed!';
    } else {
      this.showWithColor('Note not found', 'red');
      return 'Note not found';
    }
  }

  /**
   * Comprueba la validacion del color introducido
   * @param color Color introducido
   * @returns Booleano con true en caso de ser valido 
   * o false en caso contrario
   */
  private validColor(color: string): boolean {
    switch (color) {
      case 'red':
        return true;
      case 'green':
        return true;
      case 'blue':
        return true;
      case 'yellow':
        return true;
    }
    this.showWithColor('Invalid Color', 'red');
    return false;
  }

  /**
   * Muestra el texto en un color especifico o blanco por defecto
   * @param text texto a mostrar
   * @param color color 
   */
  private showWithColor(text: string, color: string): void {
    switch (color) {
      case 'red':
        console.log(chalk.red(text));
        break;
      case 'green':
        console.log(chalk.green(text));
        break;
      case 'blue':
        console.log(chalk.blue(text));
        break;
      case 'yellow':
        console.log(chalk.yellow(text));
        break;
      default:
        console.log(chalk.white(text));
    }
  }
}
