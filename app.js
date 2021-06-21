require('colors');
const {
    guardarDB,
    leerDB
} = require('./helpers/guardarArchivo');
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer');


console.clear();

const Tareas = require('./models/Tareas');

const main = async() => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();
    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear opcion
                const desc = await leerInput('Descripción');
                tareas.crearTarea(desc);
                break;
            case '2':
                //listado general
                tareas.listadoCompleto();
                break;
            case '3':
                //listado tareas completadas
                tareas.listadoPendientesCompletadas(true);
                break;
            case '4':
                //listado tareas pendientes
                tareas.listadoPendientesCompletadas(false);
                break;
            case '5':
                //completada pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toogleCompletadas(ids);
                break;
            case '6':
                //Borrar tarea
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('¿Está seguro ?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }
                break;
        }

        console.log('\n');

        guardarDB(tareas.listadoArr);

        await pausa();
    } while (opt !== '0');

}

main()