import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

import Type_arret_DFDistributionChart from '../Charts/Type_arret_DFDistributionChart';
import Name_arret_DFDistributionChart from '../Charts/name_arret_DFDistributionChart';
import Pie_char_arret_DFDistributionChart from '../Charts/Pie_chart_type_arret';
import Name_Pie_chart from '../Charts/name_Pie_chart';
import Hour_Pie from '../Charts/Hour_Pie';
import Hour_Bar from '../Charts/Hour_Bar';

import MetricsTable from './MetricsTable';
import MetricsChart from '../Charts/BAR_Metrics';

const ListRapportR0 = ({role}) => {

    const queryParams = new URLSearchParams();
    const exterieur = [
        {name: "Arret lie a la securite"},
        {name: "Coupure generale du courant"},
        {name: "Delestage"},
        {name: "Greve"},
        {name: "Intemperies"},
        {name: "Stocks pleins"},
        {name: "Jours feries"},
        {name: "Repos hebdomadaire"},
        {name: "Incident ou accident"},
        {name: "Stand by"}
    ];
    
    const materiel = [
        {name: "Defaut electrique(c.crame,reseau)"},
        {name: "Panne mecanique"},
        {name: "Panne electrique"},
        {name: "Panne electronique"},
        {name: "Piece d'usures"},
        {name: "intervention atelier pneumatique"},
        {name: "Entretien systematique"},
        {name: "Appoint(huile,gasoil)"},
        {name: "Graissage"},
        {name: "Arret electrique installation fixes"},
        {name: "Manque Camions"},
        {name: "Manque Bull"},
        {name: "Manque mecanicien"},
        {name: "Machine a l'arret"},
        {name: "Manque port chars"},
        {name: "Panne engin devant machine"}
    ];
    
    const exploitation = [
        { name: "Releve"},
        { name: "Execution plate-forme"},
        { name: "Deplacement"},
        { name: "Tir et sautage"},
        { name: "Mouvement de cable (c.grame exclu)"},
        { name: "Arret decide"},
        { name: "Manque conducteur"},
        { name: "Briquet"},
        { name: "Pistes"},
        { name: "Telescopage"},
        { name: "Arrets mecanique installations fixes"},
        { name: "Controle +Graissage"}
    ];
    
    const autre = [
        { name: "Metrage fore"},
        { name: "Nombre de trous fores"},
        { name: "Nombre de voyages"},
        { name: "M3 decapes"},
        { name: "Tonnage"},
        { name: "Nombre T.K.U"}
    ];

    const groupedOptions = {
        exterieur,
        materiel,
        exploitation,
        autre
    };


    const [phc, setPhc] = useState(0);
    const [dhc, setDhc] = useState(0);
    const [thc, setThc] = useState(0);
    const [totalhc, setTotalhc] = useState(0);

    const [HTP,setHTP]=useState(0);
    const [HC,setHC]=useState(0);
    const [OEE,setOEE]=useState(0);
    const [TD,setTD]=useState(0);
    const [TU,setTU]=useState(0);
    const [RD,setRD]=useState(0);
    const [RF,setRF]=useState(0);
    


    const [elements, setElements] = useState([]);
    const [filters, setFilters] = useState({
        time:'',
        dateOperation: '',
        secteur:'',
        engin:'',
        nameArret:'',
        post: '',
        typeArret: '',
        dateDebut: '',
        dateFin: ''
    });
    const [metricsData, setTableData] = useState([]);

    const onTableDataReady = (data) => {
        setTableData(data);
    };
 
    const getElements = async (filters = {}) => {
        const { dateOperation, post, typeArret, dateDebut, dateFin,nameArret,secteur,engin ,time} = filters;
        const queryParams = new URLSearchParams();

        if (dateOperation) queryParams.append('date_operation', dateOperation);
        if (post) queryParams.append('post', post);
        if (typeArret) queryParams.append('type_arret', typeArret);
        if (dateDebut) queryParams.append('date_debut', dateDebut);
        if (dateFin) queryParams.append('date_fin', dateFin);
        if (nameArret) queryParams.append('nom_arret', nameArret);
        if (secteur) queryParams.append('secteur', secteur);
        if (engin) queryParams.append('engin', engin);
        if (time) queryParams.append('time', time);

        try {
            
            const response = await axios.get(`http://127.0.0.1:8000/api/new_rapports?${queryParams.toString()}`);
            setElements(response.data.result);
            
            setOEE(response.data.OEE+"%")
            setTD(response.data.TD+"%")
            setTU(response.data.TU+"%")
            setRD(response.data.RD+"%")
            setRF(response.data.RF+"%")
            setHTP(response.data.htp)
            setHC(response.data.hc)
            
        
            setPhc(response.data.heur_conteur_1er);
            setDhc(response.data.heur_conteur_2eme);
            setThc(response.data.heur_conteur_3eme);
            setTotalhc( response.data.heur_conteur_1er+
                        response.data.heur_conteur_2eme+
                        response.data.heur_conteur_3eme)
            console.log("Fetched Elements: ", response.data);
        } catch (error) {
            console.error("Error fetching elements", error);
        }
    };

    useEffect(() => {
        getElements(filters);
    }, [filters]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const deleteElement = async (elementID) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/new_rapports/${elementID}`);
            console.log("Element deleted successfully");
            setElements(elements.filter(element => element.id !== elementID));
        } catch (error) {
            console.error("Error deleting element:", error);
        }
    };

    const reset = () => {
        console.log(filters.time)
        setFilters({
            nameArret:'',
            dateOperation: '',
            post: '',
            typeArret: '',
            dateDebut: '',
            dateFin: '',
            secteur:'',
            engin:'',
            time:''
        });
    };
    const extractDataAnalyzerTable = () => {
        const tableData = [
            { label: '1er Heure Arret:', value: phc },
            { label: '2eme Heure Arret:', value: dhc },
            { label: '3eme Heure Arret:', value: thc },
            { label: 'Total Heure Arret:', value: phc + dhc + thc },
            { label: 'HTP:', value: HTP },
            { label: 'Efficience Globale des Equipement:', value: OEE },
            { label: 'Taux Disponibilite:', value: TD },
            { label: 'Taux d\'Utilisation:', value: TU },
            { label: 'Rendement Foration:', value: RF },
            { label: 'Rendement Decapes:', value: RD }
        ];

        return tableData;
    };
    
   
    const exportToExcel = async () => {
    const fileName = 'report_data.xlsx';
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    
    const data = elements.map(element => ({
        ID: element.num,
        'Name Arret': element.nom_arret,
        'Type Arret': element.type_arret,
        'Date Operation': element.date_operation,
        DF: element.df,
        'Start Counter': element.d,
        'End Counter': element.f,
        Engine: element.engin,
        Sector: element.secteur,
        Post: element.post,
        'Conducteur': element.time_operation
    }));

    const metrics = metricsData.map(element => ({
        'Date Operation': element.date_operation,
        'HTP': element.htp,
        'HC': element.hc,
        'TD': element.TD,
        'TU': element.TU,
        'OEE': element.OEE,
        'Heur_Arret_1er': element.heur_conteur_1er,
        'Heur_Arret_2eme': element.heur_conteur_2eme,
        'Heur_Arret_3eme': element.heur_conteur_3eme
    }));
    
    const hourCounterData = [
        { 'Hour Arret Type': '1st Hour Arret', 'Value': phc },
        { 'Hour Arret Type': '2nd Hour Arret', 'Value': dhc },
        { 'Hour Arret Type': '3rd Hour Arret', 'Value': thc },
        { 'Hour Arret Type': 'Total Hour Arret', 'Value': phc + dhc + thc },
    ];
    
    const tableData = extractDataAnalyzerTable();
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Main Data');
    const wsHourCounters = workbook.addWorksheet('Hour Counters');
    const wsDataAnalyzer = workbook.addWorksheet('Data Analyzer');
    const wsMetricsTable = workbook.addWorksheet('Metrics Table');
    
    // Add column headers and data to worksheets
    worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
    data.forEach(row => worksheet.addRow(row));
    
    wsHourCounters.columns = Object.keys(hourCounterData[0]).map(key => ({ header: key, key }));
    hourCounterData.forEach(row => wsHourCounters.addRow(row));
    
    wsDataAnalyzer.columns = [{ header: 'Label', key: 'label' }, { header: 'Value', key: 'value' }];
    tableData.forEach(row => wsDataAnalyzer.addRow(row));
    
    wsMetricsTable.columns = [
        { header: 'Date Operation', key: 'date_operation' },
        { header: 'HTP', key: 'htp' },
        { header: 'HC', key: 'hc' },
        { header: 'TD', key: 'td' },
        { header: 'TU', key: 'tu' },
        { header: 'OEE', key: 'oee' },
        { header: 'Heur_Arret_1er', key: 'heur_conteur_1er' },
        { header: 'Heur_Arret_2eme', key: 'heur_conteur_2eme' },
        { header: 'Heur_Arret_3eme', key: 'heur_conteur_3eme' }
    ];
    metrics.forEach(row => wsMetricsTable.addRow(row));

    // Center-align all cells in all worksheets
    const centerAlignCells = (ws) => {
        ws.eachRow(row => {
            row.eachCell(cell => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });
    };

    centerAlignCells(worksheet);
    centerAlignCells(wsHourCounters);
    centerAlignCells(wsDataAnalyzer);
    centerAlignCells(wsMetricsTable);

    // Adjust column widths based on the length of the data in each column
    const adjustColumnWidths = (ws) => {
        ws.columns.forEach(column => {
            let maxLength = column.header.length;
            column.eachCell({ includeEmpty: true }, cell => {
                maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 0);
            });
            column.width = maxLength + 2; // Add some padding for better readability
        });
    };

    adjustColumnWidths(worksheet);
    adjustColumnWidths(wsHourCounters);
    adjustColumnWidths(wsDataAnalyzer);
    adjustColumnWidths(wsMetricsTable);
    
    // Capture charts as images and add them to the worksheet
    const captureAndAddImage = async (containerId, ws, cellRange) => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID ${containerId} not found.`);
            return;
        }
        const canvas = await html2canvas(container);
        const imageData = canvas.toDataURL('image/png');
        const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
        ws.addImage(imageId, cellRange);
    };

    try {
        await captureAndAddImage('charts-container', worksheet, 'A20:E40');
        await captureAndAddImage('charts-container2', worksheet, 'F20:J40');
        await captureAndAddImage('charts-container3', worksheet, 'A41:E61');
        
        // Generate Excel file and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const dataBlob = new Blob([buffer], { type: fileType });
        saveAs(dataBlob, fileName);
    } catch (error) {
        console.error('Error capturing images or generating Excel file:', error);
    }
};

    
    
    
    

    return (
        <div style={{ backgroundColor: 'black', color: 'white' }} className="container my-4">
            <h1 className="text-center mb-4">List Report R0</h1>
            <div className="row mb-4">
            {(role!=='User' &&
                <div className="col-12 d-flex justify-content-end">
                    <Link className="btn btn-primary" to="/ajouter">Add R0 Report Element</Link>
                </div>
            )}
                
            </div>
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card mb-4">
    <div className="card-header">
        <h5>Filters</h5>
    </div>
    <div className="card-body">
        <div className="row">
            <div className="col-md-4 mb-3">
                <label>Conducteur</label>
                <input
                    placeholder="Search by Conducteur"
                    className="form-control"
                    type="text"
                    name="time"
                    value={filters.time}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label>Name Arret</label>
                <select
                    className="form-control"
                    name="nameArret"
                    value={filters.nameArret}
                    onChange={handleInputChange}
                >
                    <option value="">Search by Name</option>
                        <optgroup label="Exterieur">
                            {exterieur.map((item) => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </optgroup>

                        <optgroup label="Materiel">
                            {materiel.map((item) => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </optgroup>

                        <optgroup label="Exploitation">
                            {exploitation.map((item) => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Autre">
                            {autre.map((item) => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </optgroup>
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label>Post</label>
                <select
                    className="form-control"
                    name="post"
                    value={filters.post}
                    onChange={handleInputChange}
                >
                    <option value="">Search by Post</option>
                    <option value="1er">1er</option>
                    <option value="2eme">2eme</option>
                    <option value="3eme">3eme</option>
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label>Type Arret</label>
                <select
                    className="form-control"
                    name="typeArret"
                    value={filters.typeArret}
                    onChange={handleInputChange}
                >
                    <option value="">Search by Type Arret</option>
                    <option value="exterieur">Exterieur</option>
                    <option value="materiel">Materiel</option>
                    <option value="exploitation">Exploitation</option>
                    <option value="autre">Autre</option>
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label>Secteur</label>
                <select
                    className="form-control"
                    name="secteur"
                    value={filters.secteur}
                    onChange={handleInputChange}
                >
                    <option value="">Search by  Secteur</option>
                    <option value="foration">Foration</option>
                    <option value="decapage">Decapage</option>
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label>Engin</label>
                <select
                    className="form-control"
                    name="engin"
                    value={filters.engin}
                    onChange={handleInputChange}
                >
                    <optgroup label="Foration">
                        <option value="">Search by  Engin</option>
                        <option value="PV1">PV1</option>
                        <option value="SKF1">SKF1</option>
                        <option value="SKF2">SKF2</option>
                        <option value="DKS">DKS</option>
                    </optgroup>
                    <optgroup label="Decapage">
                        <option value="7500-1">7500-1</option>
                        <option value="7500-2">7500-2</option>
                        <option value="PH-1">PH-1</option>
                        <option value="PH-2">PH-2</option>
                        <option value="200B1">200B1</option>
                        <option value="D11T1">D11T1</option>
                        <option value="D11T3">D11T3</option>
                        <option value="D11T5">D11T5</option>
                        <option value="D11T6">D11T6</option>
                        <option value="D11T7">D11T7</option>
                    </optgroup>
                </select>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label>Date Operation</label>
                <input
                    className="form-control"
                    type="date"
                    name="dateOperation"
                    value={filters.dateOperation}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label>Date Debut</label>
                <input
                    className="form-control"
                    type="date"
                    name="dateDebut"
                    value={filters.dateDebut}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label>Date Fin</label>
                <input
                    className="form-control"
                    type="date"
                    name="dateFin"
                    value={filters.dateFin}
                    onChange={handleInputChange}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-warning" onClick={reset}>Reset</button>
            </div>
        </div>
    </div>
</div>


            <div>
                <MetricsTable 
                 htp={HTP} hc={HC} td={TD} 
                 tu={TU} oee={OEE} 
                 phc={phc} dhc={dhc} thc={thc}
                 filters={filters}
                 onTableDataReady={onTableDataReady} />
            </div>
           
            
                <div style={{ backgroundColor: 'black', color: 'white' }} className="card mb-4  mx-auto">
                        <div className="card-header">
                            <h2>data filtred</h2>
                        </div>
                    <div className="card-body d-flex justify-content-center">
                        <table className="table table-dark table-striped">
                            <tbody>
                                <tr>
                                    <th className='text-center m-0'>1er Heure Arret:</th>
                                    <td className='text-center'>{phc}</td>
                                </tr>
                                <tr>
                                    <th className='text-center m-0'>2eme Heure Arret:</th>
                                    <td className='text-center'>{dhc}</td>
                                </tr>
                                <tr>
                                    <th className='text-center m-0'>3eme Heure Arret:</th>
                                    <td className='text-center'>{thc}</td>
                                </tr>
                                <tr>
                                    <th className='text-center m-0'>Total Heure Arret:</th>
                                    <td className='text-center'>{totalhc}</td>
                                </tr>
                                <tr>
                                            <th className='text-center m-0'>HTP:</th>
                                            <td className='text-center'>{HTP}</td>
                                </tr>
                                
                                    <>
                                        <tr>
                                            <th className='text-center m-0'>Efficience Globale des Equipement:</th>
                                            <td className='text-center'>{OEE}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-center m-0'>Taux Disponibilite:</th>
                                            <td className='text-center'>{TD}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-center m-0'>Taus d'Utilisation:</th>
                                            <td className='text-center'>{TU}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-center m-0'>Rendement Foration:</th>
                                            <td className='text-center'>{RF}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-center m-0'>Rendement Decapes:</th>
                                            <td className='text-center'>{RD}</td>
                                        </tr>
                                       
                                    </>
                               
                            </tbody>
                        </table>
                    </div>
                </div>


                
            <div style={{ backgroundColor: 'black', color: 'white' }} className="card py-5 pt-0">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Elements</h5>
                    <div className="d-flex">
                        <button className="btn btn-success" onClick={exportToExcel}>Export to Excel</button>
                    </div>
                </div>
                <div  className="card-body table-responsive">
                    <table  className="table table-striped table-dark" width="100%" cellSpacing="0">
                        <thead className="thead-dark">
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">Name Arret</th>
                                <th className="text-center">Type Arret</th>
                                <th className="text-center">Date Operation</th>
                                <th className="text-center">DF</th>
                                <th className="text-center">Start Counter</th>
                                <th className="text-center">End Counter</th>
                                <th className="text-center">Engin</th>
                                <th className="text-center">Sector</th>
                                <th className="text-center">Post</th>
                                <th className="text-center">Conducteur</th>
                                {
                                            (role!=='User' &&
                                <th className="text-center">Action</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {elements.length > 0 ? (
                                elements.map((element, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{element.num}</td>
                                        <td className="text-center">{element.nom_arret}</td>
                                        <td className="text-center">{element.type_arret}</td>
                                        <td className="text-center">{element.date_operation}</td>
                                        <td className="text-center">{element.df}</td>
                                        <td className="text-center">{element.d}</td>
                                        <td className="text-center">{element.f}</td>
                                        <td className="text-center">{element.engin}</td>
                                        <td className="text-center">{element.secteur}</td>
                                        <td className="text-center">{element.post}</td>
                                        <td className="text-center">{element.time_operation}</td>
                                        {
                                            (role!=='User' &&

                                        <td className="text-center">
                                            <button onClick={() => deleteElement(element.id)} className="btn btn-danger btn-sm">&times;</button>
                                        </td>
                                            )
                                        }

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">No Data Available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             
                <div id="charts-container" className="container d-flex align-items-center">
                    <div className="container">
                        <Name_Pie_chart data={elements} />
                    </div>
                    <div className="container">
                        <Name_arret_DFDistributionChart data={elements} />
                    </div>
                </div>
                
               
               
                <div id="charts-container3" className="container d-flex align-items-center">
                    <div className="container">
                        <Hour_Pie phc={phc} dhc={dhc} thc={thc} />
                    </div>
                    <div className="container">
                        <Hour_Bar phc={phc} dhc={dhc} thc={thc} />
                    </div>
                </div>
                
                <div id="charts-container2" className="container d-flex align-items-center">
                    <div className="container">
                        <Pie_char_arret_DFDistributionChart data={elements} />
                    </div>
                    <div className="container">
                        <Type_arret_DFDistributionChart data={elements} />
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default ListRapportR0;