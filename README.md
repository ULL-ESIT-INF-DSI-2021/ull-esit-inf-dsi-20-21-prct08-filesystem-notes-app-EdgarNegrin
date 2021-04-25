
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EdgarNegrin/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EdgarNegrin?branch=master)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EdgarNegrin/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EdgarNegrin/actions/workflows/tests.yml)


# Introducción

En esta practica seguiremos utilizando el lenguaje TypeScript para hacer uso de las diferentes APIs que tiene Node.js disponibles, los modulos yargs y chalk. Se creará una aplicación de gestión de notas.
# Objetivos

Los principales objetivos de esta practica son:

* Manejo del módulo **yargs** para implementar la aplicacion de notas por linea de comandos.
* Manejo del módulo **chalk** para implementar los colores en la consola.
* Manejo de las APIs proporcionadas por Node.js para trabajar con el sistema de ficheros.

# Creación de la estructura

Se ha comenzado la práctica creando la estructura del proyecto como se ha aprendido en las practicas anteriores. Siguiento el [tutorial](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html) que se nos ha proporcionado. El ejercicio se ha realizado dentro del directorio *src/*. Se han activado las github Actions para mantener un control del código.

Para ejecutar las pruebas solo será necesario ejecutar ``npm run test``.

# Funcionalidad

Se requiere una aplicacion para procesar notas de texto. Con las siguientes funcionalidades:

* Añadir una nota a la lista.
* Modificar una nota de la lista.
* Eliminar una nota de la lista.
* Listar los títulos de las notas.
* Leer una nota concreta.

Las notas se almacenarán por usuario, teniendo un directorio para cada uno de ellos y una .JSON para cada nota. Todo esto dentro de un directorio denominado *./notes*.

# Diseño

Para la realización de esta aplicación, se crearon dos ficheros, uno con el programa principal que maneja los paramatros introducidos *note-app.ts* y otro con la clase Notes *notes.ts*.

# Implementación

Comenzaremos con la clase **Notes**, esta maneja la API de Node.js. En esta tenemos un atributo estatico y privado para mantener el encapsulamiento y hacer que esta clase se encargue de gestionar las notas en la propia clase.

```
export class Notes {
  private static notes: Notes;

  private constructor() {
  }
```

Como el contructor es privado, debemos crear un metodo para hacer la llamada desde el exterior, para ello crearemos *getNotes()* que devolvera el atributo de la clase. Este metodo tambien será el encargado de crear el directorio notes en caso de no existir.

```
public static getNotes(): Notes {
  if (!Notes.notes) {
    Notes.notes = new Notes();
  }
  if (!fs.existsSync('./notes')) {
    fs.mkdirSync('./notes', {recursive: true});
  }
  return Notes.notes;
}
```

Para mostrar una nota en especifico crearemos un metodo público *showNote*, este recibira dos string, uno con el nombre del usuario y otro con el titulo de la nota que se desea mostrar.

```
public showNote(userName: string, title: string)
```

Debemos comprobar si la nota existe, para en caso de que no exista mostrar el error correspondiente. En caso de que si exista dicha nota se extraera el JSON para poder mostrarlo por partes y extraer el color con el que se va a mostrar.

```
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
```

Para mostrar el listado de notas de un usuario debemos crear un metodo público *showNotes*, que recibirá por parametro el nombre del usuario.
 
```
public showNotes(userName: string): string
```

Debemos comprobar que existe un directorio para el usuario que se ha pasado, en caso de no exitir se mostrará un error con su respectivo color. En caso de que si exista el directorio del usuario se recorreran los ficheros del directorio extraendo el titulo y el color que le corresponde. Para poder realizar los tests se almacena el listado y se retorna.

```
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
```

Otro metodo necesario será *addNotes*, que añadira una nueva nota, este recibira por parametro el nombre de usuario, el titulo, el cuerpo de la nota y el color, todos ellos string.

```
public addNotes(userName: string, title: string, body: string, color: string): string
```

Lo primero que debemos realizar es comprobar el color que se ha introducido, para ello usamos el metodo *validColor()* que se explicará posteriormente, este muestra un error en caso de no ser correcto el color pero permite introducir la nota. Comprobamos que existe el usuario y que no exista una nota con el mismo nombre, en caso de que exista el usuario solo debemos crear la nueva nota. En caso de que no exista el usuario primero debemos crearlo y luego crear la nota.

```
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
```

Otro metodo necesario es el *removeNote* que se encargará de eliminar una nota por titulo. Este recibirá un nombre de usuario y el titulo de la nota que se quiere eliminar en string.

```
public removeNote(userName: string, title: string): string
```

Para poder eliminar una nota primero debe existir, en caso de que exista se elimina, en caso contrario se muestra el error.

```
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
```

Para comprobar que se ha introducido un color valido se ha creado un metodo *validColor* que recibe el color en string. Este metodo será privado para que solo se pueda acceder desde el interior de la clase.

```
private validColor(color: string): boolean
```

Para comprobar el color se usará un switch, en caso de que sea un color valido se devolverá true, en caso contrario se mostrará un error pero se continuará con la ejecución.

```
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
```

Por último se necesita un metodo privado para mostrar el texto por consola con el color deseado haciendo uso del modulo *chalk*. Este recibe el texto que se desea mostrar y el color en string.

```
private showWithColor(text: string, color: string): void
```

Se volverá a hacer uso del switch para comprobar el color, en caso de que no sea un color valido se mostrara en blanco por defecto.

```
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
```

El **programa principal** esta situado en *note-app.ts*, en este utilizaremos el módulo yargs para hacer uso de los diferentes metodos de la clase **Notes**.

Debemos hacer uso del metodo *command* para cada uno de los comandos implementados, donde estableceremos el comando, una descripción del comando y los argumentos necesarios.

```
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
```

Seguido de esto, establecemos la funcion *handler* a la que se le pasa *argv*. En esta comprobamos el tipo de dato introducido y se llama al metodo que implementa el comando, en este caso el *addNote*.

```
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.color === 'string' && typeof argv.body === 'string') {
      notes.addNotes(argv.user, argv.title, argv.body, argv.color);
    }
  },
});
```

Esto se ha realizado con cada uno de los comandos que se han implementado con su correspondiente llamada al metodo necesario para la implementación.

# Ejemplos de ejecucion

**List**
```
$node dist/note-app.js list --user="Edgar"
Your notes
compra
```

**Show**
```
$node dist/note-app.js show --user="Edgar" --title="compra"
compra
leche, huevos
```

**Add**
```
$node dist/note-app.js add --user="Edgar" --title="juegos" --body="csgo, fifa" --color="yellow"
New note added!
```

**Remove**
```
$node dist/note-app.js remove --user="Edgar" --title="juegos"
Note removed!
```

# Conclusiones

Con la realización del ejercicio propuesto en esta práctica se ha podido profundizar en las diferentes funcionalidades que tienen las APIs de Node.js, teniendo diversas formas de combinarlos para una mejor implementación facilitando muchas tareas. Cada uno de estas funcionalidades tiene diferentes situaciones en las que nos puede ayudar, por lo que se debe conocer los diferentes momentos en los que se debe utilizar para agilizar el trabajo.

# Bibliografia

* [Chalk](https://www.npmjs.com/package/chalk)
* [Yargs](https://www.npmjs.com/package/yargs)
* [File system](https://nodejs.org/api/fs.html)

