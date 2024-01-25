const { response } = require('express')
const { Evaluacione } = require("../models/evaluacione");
const { Institucione } = require("../models/institucione")
const { QueryTypes } = require("sequelize");
const PDFDocument = require("pdfkit-table");

const evaluacionesGet = async (req, res = response) => {
    const { institucion = 0 } = req.query

    const query = {
        where: {
            institucion_id: institucion
        }
    }

    const [total, evaluaciones] = await Promise.all([
        Evaluacione.count(query),
        Evaluacione.findAll(query)
    ])

    res.json({
        total,
        evaluaciones
    })
}

const evaluacionesResultGet = async (req, res = response) => {
    const { test_id = 1, grado_id = 6, seccion_id = 1, institucion_id } = req.query

    const evaluaciones = await Evaluacione.sequelize.query("select e.id, a.nie, a.genero, CONCAT(a.nombres, ' ', a.apellidos) AS alumno, a.fecha_nacimiento, CONCAT(a.grado_id, ' \"', sc.seccion,'\"') AS grado, e.resultado, e.createdAt from evaluaciones e INNER JOIN tests t ON e.test_id = t.id INNER JOIN alumnos a ON a.id = e.alumno_id INNER JOIN secciones sc ON sc.id = a.seccion_id WHERE a.grado_id = :grado_id AND a.seccion_id = :seccion_id AND test_id = :test_id AND e.Estado != 'A' AND a.institucion_id = :institucion_id", {
        replacements: { grado_id, seccion_id, test_id, institucion_id },
        type: QueryTypes.SELECT
    })

    if (evaluaciones.length < 1) {
        return res.status(404).json({
            errors: [{ msg: "No se encontraron datos" }]
        })
    }

    const arrRest = []
    for (const evaluacion of evaluaciones) {
        const diff = new Date(evaluacion.createdAt).getTime() - new Date(evaluacion.fecha_nacimiento).getTime()
        const years = (diff / (1000 * 60 * 60 * 24)) / 365;
        evaluacion.years = parseInt(years, 10);

        let observaciones = '';
        const detalles = await Evaluacione.sequelize.query("SELECT ev.respuesta, ev.observaciones, td.question FROM evaluacion_details ev INNER JOIN tests_details td ON td.id = ev.test_detail_id WHERE ev.evaluacion_id = :id", {
            replacements: { id: evaluacion.id },
            type: QueryTypes.SELECT
        })

        const evaluacionConNuevaPropiedad = { ...evaluacion, detalles: [] };
        let total = 0

        detalles.forEach(detalle => {
            observaciones += detalle.observaciones != '' ? detalle.observaciones + ", " : ''
            const nombre = detalle.question.split('+')[0];
            evaluacionConNuevaPropiedad.detalles.push({ respuesta: detalle.respuesta, nombre })
            evaluacionConNuevaPropiedad.observaciones = observaciones
            if (detalle.respuesta === 1) {
                total++
            }
        }); 

        if (grado_id > 2) {
            evaluacionConNuevaPropiedad.detalles.splice(0, 0, evaluacionConNuevaPropiedad.detalles.splice(2, 1)[0])
            evaluacionConNuevaPropiedad.detalles.splice(1, 0, evaluacionConNuevaPropiedad.detalles.splice(2, 1)[0])
        }

        arrRest.push(evaluacionConNuevaPropiedad)
    }

    res.json({
        result: arrRest
    })
}

const pdf = async (req, res = response) => {

    const { test_id = 1, grado_id = 6, seccion_id = 1, institucion_id } = req.query

    const [evaluaciones, insti] = await Promise.all([
        await Evaluacione.sequelize.query("select e.id, a.nie, a.genero, CONCAT(a.nombres, ' ', a.apellidos) AS alumno, a.fecha_nacimiento, CONCAT(a.grado_id, ' \"', sc.seccion,'\"') AS grado, e.resultado, e.createdAt from evaluaciones e INNER JOIN tests t ON e.test_id = t.id INNER JOIN alumnos a ON a.id = e.alumno_id INNER JOIN secciones sc ON sc.id = a.seccion_id WHERE a.grado_id = :grado_id AND a.seccion_id = :seccion_id AND test_id = :test_id AND e.Estado != 'A' AND a.institucion_id = :institucion_id", {
            replacements: { grado_id, seccion_id, test_id, institucion_id },
            type: QueryTypes.SELECT
        }),
        await Institucione.findByPk(institucion_id)
    ])

    if (evaluaciones.length < 1) {
        return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="utf-8">
                <title>Error</title>
            </head>
            <body>
                <pre>No se encontraron datos
            </body>
        </html>
        `)
    }

    const arrRest = []
    for (const evaluacion of evaluaciones) {
        const diff = new Date(evaluacion.createdAt).getTime() - new Date(evaluacion.fecha_nacimiento).getTime()
        const years = (diff / (1000 * 60 * 60 * 24)) / 365;
        evaluacion.years = parseInt(years, 10);

        let observaciones = '';
        const detalles = await Evaluacione.sequelize.query("SELECT ev.respuesta, ev.observaciones, td.question FROM evaluacion_details ev INNER JOIN tests_details td ON td.id = ev.test_detail_id WHERE ev.evaluacion_id = :id ORDER BY td.id ASC", {
            replacements: { id: evaluacion.id },
            type: QueryTypes.SELECT
        })

        const evaluacionConNuevaPropiedad = { ...evaluacion, detalles: [] };

        let total = 0

        detalles.forEach(detalle => {
            observaciones += detalle.observaciones != '' ? detalle.observaciones + ", " : ''
            const nombre = detalle.question.split('+')[0];
            evaluacionConNuevaPropiedad.detalles.push({ respuesta: detalle.respuesta, nombre, tamaño: (372/detalles.length) })
            evaluacionConNuevaPropiedad.observaciones = observaciones
            if (detalle.respuesta === 1) {
                total++
            }
        });

        
        if (grado_id > 2) {
            evaluacionConNuevaPropiedad.detalles.splice(0, 0, evaluacionConNuevaPropiedad.detalles.splice(2, 1)[0])
            evaluacionConNuevaPropiedad.detalles.splice(1, 0, evaluacionConNuevaPropiedad.detalles.splice(2, 1)[0])
        }

        console.log(evaluacionConNuevaPropiedad.detalles);
        if (detalles.length > 6) {
            evaluacionConNuevaPropiedad.detalles = [{respuesta: total+' de '+detalles.length, nombre: 'Total de respuestas correctas', tamaño: 372}]
        }
        arrRest.push(evaluacionConNuevaPropiedad)
    }

    const columnasDetalles = arrRest.reduce((columnas, evaluacion) => {
        evaluacion.detalles.forEach(detalle => {
            if (!columnas.includes(detalle.nombre)) {
                columnas.push(detalle.nombre);
            }
        });
        return columnas;
    }, []);

    const tarl = grado_id > 2 ? '3.°- 6.' : grado_id;


    let doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    doc.font('Helvetica-Bold').text('HOJA DE REGISTRO DE LECTOESCRITURA', {
        align: 'center'
    })
    .font('Helvetica').text(`TaRL ${tarl}° grado`, {
        align: 'center'
    })
    .text(' ')
    doc.fontSize(10)
    
    doc.text('GRADO Y SECCION: ', {
        continued:true
    })
    .font('Helvetica-Bold')
    .text(arrRest[0].grado, {
        width: 1000,
        continued:true
    })
    .font('Helvetica')
    .text('    FECHA DE LA MEDICION INICIAL: ', {
        continued: true,
        width: 1000,
    })
    .font('Helvetica-Bold')
    .text(arrRest[0].createdAt.toLocaleString('es-MX').split(',')[0], {
        width: 465,
    })

    doc
    .font('Helvetica')
    .text('ESCUELA: ', {
        continued:true
    })
    .font('Helvetica-Bold')
    .text(insti.institucion, {
        width: 465,
        continued:true
    })
    .font('Helvetica')
    .text('    SECTOR: ', {
        continued:true
    })
    .font('Helvetica-Bold')
    .text(insti.sector, {
        width: 465,
    })


    doc.text(' ')
    const table = {
        // title: "Grado y seccion:",

        // subtitle: "Escuela:",
        
        headers: [
            {
                label: "No.", width: 20, property:'years',
                renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return indexRow+1 },
                
            },
            { label: "Nombre de la niña o niño participante", property: 'alumno', width: 150, renderer: null },
            { label: "Genero", property: 'genero', align: 'center', width: 30, renderer: null },
            { label: "Edad", property: 'years', align: 'center', width: 30, renderer: null },
            { label: "Grado", property: 'grado', align: 'center', width: 30, renderer: null },
            ...columnasDetalles.map(nombre => ({
                
                label: `${nombre}`,
                width: arrRest[0].detalles[0].tamaño,
                property: 'detalles',
                align: 'center',
                renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
                    
                        const detalleEncontrado = arrRest[indexRow].detalles.find(detalle => detalle.nombre === nombre);
                        return detalleEncontrado ? detalleEncontrado.respuesta : null;
                    
                }
            })),
            { label: "Resultado", property: 'resultado', align: 'center', width: 65, renderer: null },
            { label: "Observaciones", property: 'observaciones', align: 'center', width: 100, renderer: null },
        ],
        
        // simeple data
        datas: arrRest,
    };
    // the magic
    doc.table(table, {
        options: {
            // divider lines
            divider: {
              header: {disabled: true, width: 0.5, opacity: 0.5},
              horizontal: {disabled: true, width: 0.5, opacity: 0.5},
            },
          },
        padding:1,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            doc.font("Helvetica").fontSize(8).fillColor('#292929')
        }
        
    });

    //Mandamos la respuesta
    doc.pipe(res);
    // done!
    doc.end();


}

const evaluacionGet = async (req, res = response) => {
    const id = req.params.id;

    const evaluacion = await Evaluacione.sequelize.query("SELECT CONCAT(al.nombres, ' ', al.apellidos) AS alumno, t.test_name, e.*, al.grado_id FROM evaluaciones e INNER JOIN docentes d ON d.id = e.docente_id INNER JOIN alumnos al ON al.id = e.alumno_id INNER JOIN tests t ON t.id = e.test_id WHERE e.id = :id", {
        replacements: { id },
        type: QueryTypes.SELECT
    })
    if (evaluacion.length <= 0) {
        res.status(404).json({ errors: [{ msg: "no se encontro la evaluacion" }] })
    } else {
        res.json({ evaluacion })
    }
}

const evaluacionesPost = async (req, res) => {
    const { body } = req;
    try {

        const query = {
            where: {
                test_id: body.test_id,
                alumno_id: body.alumno_id
            }
        }

        const existEvaluacion = await Evaluacione.findOne(query);

        if (existEvaluacion) {
            if (existEvaluacion.estado == 'A') {
                return res.json({
                    evaluacione: existEvaluacion
                })
            }
            return res.status(409).json({
                errors: [{ msg: "El alumno ya ha sido evaluado" }]
            })
        }

        const evaluacione = Evaluacione.build(body);
        await evaluacione.save();

        res.json({
            evaluacione
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const evaluacionesPut = async (req, res = response) => {

    const id = req.params.id;

    const { body } = req

    const evaluacione = await Evaluacione.update({ estado: body.estado, resultado: body.resultado }, {
        where: {
            id
        }
    })

    res.json({
        evaluacione
    })
}

const evaluacionesDelete = async (req, res = response) => {
    const { id } = req.params

    const evaluacione = await Evaluacione.findByIdAndUpdate(id, { estado: false })

    res.json({
        evaluacione
    })
}


module.exports = {
    evaluacionesGet,
    evaluacionesResultGet,
    evaluacionGet,
    evaluacionesPost,
    evaluacionesPut,
    evaluacionesDelete,
    pdf
}