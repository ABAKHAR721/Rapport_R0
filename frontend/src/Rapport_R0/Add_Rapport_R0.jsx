import React, { useState } from 'react';
import axios from 'axios';

const Formtest = () => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        id: '',
        name: '',
        typeArret: '',
        post: '',
        d: '',
        f: '',
        df: '',
        secteur: '',
        engin: ''
    });

    const [temporaryTable, setTemporaryTable] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const exterieur = [
        { id: 120, name: "Arret lie a la securite", type: "exterieur" },
        { id: 121, name: "Coupure generale du courant", type: "exterieur" },
        { id: 122, name: "Delestage", type: "exterieur" },
        { id: 123, name: "Greve", type: "exterieur" },
        { id: 124, name: "Intemperies", type: "exterieur" },
        { id: 125, name: "Stocks pleins", type: "exterieur" },
        { id: 126, name: "Jours feries", type: "exterieur" },
        { id: 127, name: "Repos hebdomadaire", type: "exterieur" },
        { id: 128, name: "Incident ou accident", type: "exterieur" },
        { id: 129, name: "Stand by", type: "exterieur" }
    ];

    const materiel = [
        { id: 230, name: "Defaut electrique(c.crame,reseau)", type: "materiel" },
        { id: 231, name: "Panne mecanique", type: "materiel" },
        { id: 232, name: "Panne electrique", type: "materiel" },
        { id: 233, name: "Panne electronique", type: "materiel" },
        { id: 234, name: "Piece d'usures", type: "materiel" },
        { id: 235, name: "intervention atelier pneumatique", type: "materiel" },
        { id: 236, name: "Entretien systematique", type: "materiel" },
        { id: 237, name: "Appoint(huile,gasoil)", type: "materiel" },
        { id: 238, name: "Graissage", type: "materiel" },
        { id: 239, name: "Arret electrique installation fixes", type: "materiel" },
        { id: 240, name: "Manque Camions", type: "materiel" },
        { id: 241, name: "Manque Bull", type: "materiel" },
        { id: 242, name: "Manque mecanicien", type: "materiel" },
        { id: 243, name: "Machine a l'arret", type: "materiel" },
        { id: 244, name: "Manque port chars", type: "materiel" },
        { id: 245, name: "Panne engin devant machine", type: "materiel" }
    ];

    const exploitation = [
        { id: 440, name: "Releve", type: "exploitation" },
        { id: 441, name: "Execution plate-forme", type: "exploitation" },
        { id: 442, name: "Deplacement", type: "exploitation" },
        { id: 443, name: "Tir et sautage", type: "exploitation" },
        { id: 444, name: "Mouvement de cable (c.grame exclu)", type: "exploitation" },
        { id: 445, name: "Arret decide", type: "exploitation" },
        { id: 446, name: "Manque conducteur", type: "exploitation" },
        { id: 447, name: "Briquet", type: "exploitation" },
        { id: 448, name: "Pistes", type: "exploitation" },
        { id: 449, name: "Telescopage", type: "exploitation" },
        { id: 450, name: "Arrets mecanique installations fixes", type: "exploitation" },
        { id: 451, name: "Controle +Graissage", type: "exploitation" }
    ];
    const autre=[
             {id:610,name:"Metrage fore" ,type:"autre"},
             {id:620,name:"Nombre de trous fores" ,type:"autre"}, 
             {id:630,name:"Nombre de voyages" ,type:"autre"}, 
             {id:640,name:"M3 decapes" ,type:"autre"},
             {id:650,name:"Tonnage" ,type:"autre"},
             {id:660,name:"Nombre T.K.U" ,type:"autre"},
    ];

    const optionsID = [
        { label: 'Exterieur', options: exterieur.map(item => item.id) },
        { label: 'Materiel', options: materiel.map(item => item.id) },
        { label: 'Exploitation', options: exploitation.map(item => item.id) },
        { label: 'autre', options: autre.map(item => item.id) }
    ];

    const optionsName = [
        { label: 'Exterieur', options: exterieur.map(item => item.name) },
        { label: 'Materiel', options: materiel.map(item => item.name) },
        { label: 'Exploitation', options: exploitation.map(item => item.name) },
        { label: 'autre', options: autre.map(item => item.name) }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === 'name') {
            const selected = [...exterieur, ...materiel, ...exploitation, ...autre].find(item => item.name === value);
            if (selected) {
                updatedFormData = {
                    ...updatedFormData,
                    id: selected.id.toString(),
                    typeArret: selected.type
                };
            } else {
                updatedFormData = {
                    ...updatedFormData,
                    id: '',
                    typeArret: ''
                };
            }
        }
        // console.log(updatedFormData);
        if (name === 'id') {
            const selected = [...exterieur, ...materiel, ...exploitation,...autre].find(item => item.id.toString() === value);
            if (selected) {
                updatedFormData = {
                    ...updatedFormData,
                    name: selected.name,
                    typeArret: selected.type
                };
            } else {
                updatedFormData = {
                    ...updatedFormData,
                    name: '',
                    typeArret: ''
                };
            }
        }

        setFormData(updatedFormData);

        // Clear error message if input is filled
        if (value.trim() !== '') {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (formData.date.trim() === '') {
            errors.date = 'Date is required';
        }
        if (formData.time.trim() === '') {
            errors.time = 'Conducteur is required';
        }
        if (formData.id.trim() === '') {
            errors.id = 'ID is required';
        }
        if (formData.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (formData.typeArret.trim() === '') {
            errors.typeArret = 'Type Arret is required';
        }
        if (formData.post.trim() === '') {
            errors.post = 'Post is required';
        }
        if (formData.d.trim() === '') {
            errors.d = 'D is required';
        }
        if (formData.f.trim() === '') {
            errors.f = 'F is required';
        }
        if (formData.df.trim() === '') {
            errors.df = 'DF is required';
        }
        if (formData.secteur.trim() === '') {
            errors.secteur = 'Secteur is required';
        }
        if (formData.engin.trim() === '') {
            errors.engin = 'Engin is required';
        }
        return errors;
    };

    const handleAddToTable = (e) => {
        e.preventDefault();
        const newEntry = {
            date: formData.date,
            time: formData.time,
            id: formData.id,
            name: formData.name,
            typeArret: formData.typeArret,
            post: formData.post,
            d: Number(formData.d),
            f: Number(formData.f),
            df: Number(formData.df),
            secteur: formData.secteur,
            engin: formData.engin
        };

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setTemporaryTable([...temporaryTable, newEntry]);
        setFormData({
            date: formData.date,
            time: formData.time,
            id: '',
            name: '',
            typeArret: '',
            post: '',
            d: formData.d,
            f: formData.f,
            df: '',
            secteur: formData.secteur,
            engin: formData.engin
        });
    };

    const handleSendRequest = () => {
        const requestData = {
            date_operation: formData.date,
            secteur: formData.secteur,
            engin: formData.engin,
            data: temporaryTable.map(entry => ({
                num: entry.id.toString(),
                nom_arret: entry.name,
                type_arret: entry.typeArret,
                post: entry.post,
                time_operation: entry.time,
                d: entry.d,
                f: entry.f,
                df: entry.df
            }))
        };

        axios.post('http://127.0.0.1:8000/api/new_rapports', requestData)
            .then(response => {
                console.log(response.data);
                setSuccessMessage(response.data.message);
                setTemporaryTable([]);
                setFormData({
                    date: '',
                    time: '',
                    id: '',
                    name: '',
                    typeArret: '',
                    post: '',
                    d: '',
                    f: '',
                    df: '',
                    secteur: '',
                    engin: ''
                });
                
            })
            .catch(error => {
                console.error('Error:', error.response.data);
                setErrorMessage('Error submitting data. Please try again.');
            });
    };

    const deleteItem = (index) => {
        let updatedTable = [...temporaryTable];
        updatedTable.splice(index, 1);
        setTemporaryTable(updatedTable);
    };

    // const optionsID = [
    //     { label: 'Exterieur', options: [120, 121, 122, 123, 124, 125, 126, 127, 128, 129] },
    //     { label: 'Materiel', options: [230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 244] },
    //     { label: 'Exploitation', options: [440,441,442,443,444,445,446,447,448,449,450] },
    //     { label: 'Autre', options: [610,620,630,640,650,660] }


    // ];

    // const optionsName = [
    //     {
    //         label: 'Exterieur',//type=Exterieur
    //         options: [
    //             "Arret lie a la securite",//id=120
    //             "Coupure generale du courant",//id=121
    //             "Delestage",//id=122
    //             "Greve",//id=123
    //             "Intemperies",//id=124
    //             "Stocks pleins",//id=125
    //             "Jours feries",//id=126
    //             "Repos hebdomadaire",//id=127
    //             "Incident ou accident",//id=128
    //             "Stand by"//id=129
    //         ]
    //     },
    //     {
    //         label: 'Materiel',//type=Materiel
    //         options: [
    //             "defaut electrique(c.crame,reseau)",//id=230
    //             "panne mecanique",//id=231
    //             "panne electrique",//id=232
    //             "Piece d'usures",//id=233
    //             "intervention atelier pneumatique",//id=234
    //             "Entretien systematique",//id=235
    //             "Appoint(huile,gasoil)",//id=236
    //             "Graissage",//id=237
    //             "Arret electrique installation fixes",//id=238
    //             "Manque Camions",//id=239
    //             "Manque Bull",//id=240
    //             "Manque mecanicien",//id=241
    //             "Machine a l'arret",//id=242
    //             "Manque port chars",//id=243
    //             "Panne engin devant machine"//id=244
    //         ]
    //     },
    //     {
    //         label: 'Exploitation',//type=Exploitation
    //         options: [
    //             "Releve",//id=440
    //             "Execution plate-forme",//id=441
    //             "Deplacement",//id=442
    //             "Tir et sautage",//id=443
    //             "Mouvement de cable (c.grame exclu)",//id=444
    //             "Arret decide",//id=445
    //             "Manque conducteur",//id=446
    //             "Briquet",//id=447
    //             "Pistes (intemperies exclues)",//id=448
    //             "Telescopage",//id=449
    //             "Arrets mecanique installations fixes"//id=450
    //         ]
    //     },
    //     {
    //         label: 'Autre',//type=Exploitation
    //         options: [
    //             "Metrage fore",//id=610
    //             "Nombre de trous fores",//id=620
    //             "Nombre de voyages",//id=630
    //             "M3 decapes",//id=640
    //             "Tonnage",//id=650
    //             "Nombre T.K.U"//id=660
    //         ]
    //     }
    // ];
    

    return (
        <div className='container mt-4'>
            <h1 className="text-center">Rapport R0</h1>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {temporaryTable.length > 0 && (
                <button className="btn btn-primary mb-4" onClick={handleSendRequest}>Send Request</button>
            )}

            {temporaryTable.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Conducteur</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type Arret</th>
                            <th>Post</th>
                            <th>D</th>
                            <th>F</th>
                            <th>DF</th>
                            <th>Secteur</th>
                            <th>Engin</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temporaryTable.map((row, index) => (
                            <tr key={index}>
                                <td>{row.date}</td>
                                <td>{row.time}</td>
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>{row.typeArret}</td>
                                <td>{row.post}</td>
                                <td>{row.d}</td>
                                <td>{row.f}</td>
                                <td>{row.df}</td>
                                <td>{row.secteur}</td>
                                <td>{row.engin}</td>
                                <td>
                                    <button onClick={() => deleteItem(index)} className='btn btn-danger' type="button">&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <form onSubmit={handleAddToTable}>
                <label>Date Operation</label>
                <input
                    className={`form-control m-1 ${errors.date ? 'is-invalid' : ''}`}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}

                <div>
                    <label>Conducteur</label>
                    <input
                        placeholder='Conducteur'
                        className={`form-control m-1 ${errors.time ? 'is-invalid' : ''}`}
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                    />
                    {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                </div>

                <div>
                    <label>Secteur</label>
                    <select

                                    className={`form-control ${errors.secteur ? 'is-invalid' : ''}`}
                                    name="secteur"
                                    value={formData.secteur}
                                    onChange={handleInputChange}
                                >
                                    <option value="">_</option>
                                    <option value="foration">Foration</option>
                                    <option value="decapage">Decapage</option>
                                </select>
                    {errors.secteur && <div className="invalid-feedback">{errors.secteur}</div>}
                </div>

                <div>
                    <label>Engin</label>
                    <select
                                    className={`form-control ${errors.engin ? 'is-invalid' : ''}`}
                                    name="engin"
                        	     value={formData.engin}
                                    onChange={handleInputChange}
                                >
                                 <optgroup label='Foration'>
                                 
                                 	<option value="">_</option>
                                    	<option value="PV1">PV1</option>
                                    	<option value="SKF1">SKF1</option>
                                    	<option value="SKF2">SKF2</option>
                                    	<option value="DKS">DKS</option>
                                    	
                                 </optgroup>
                                 
                                 <optgroup label='decapage'>
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
                    {errors.engin && <div className="invalid-feedback">{errors.engin}</div>}
                </div>

                <table className="table table-dark mt-2">
                    <thead className="thead-dark mt-2">
                        <tr>
                            <th>ID</th>
                            <th>Nom Arret</th>
                            <th>Type Arret</th>
                            <th>Post</th>
                            <th>
                                <label className='mx-1'>D</label>
                                <input
                                    type="number"
                                    name="d"
                                    value={formData.d}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.d ? 'is-invalid' : ''}`}
                                    placeholder="Debut Counteur"
                                    style={{ width: '170px' }}
                                />
                                <br />
                                <label className='mx-1'>F</label>
                                <input
                                    type="number"
                                    name="f"
                                    value={formData.f}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.f ? 'is-invalid' : ''}`}
                                    placeholder="FIn Counteur"
                                    style={{ width: '170px' }}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select
                                    className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                >
                                    <option>_</option>
                                    {optionsID.map((group, index) => (
                                        <optgroup key={index} label={group.label}>
                                            {group.options.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                            </td>

                            <td>
                                <select
                                    className={`form-control mx-1 ${errors.name ? 'is-invalid' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                >
                                    <option>_</option>
                                    {optionsName.map((group, index) => (
                                        <optgroup key={index} label={group.label}>
                                            {group.options.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </td>

                            <td>
                                <select
                                    className={`form-control ${errors.typeArret ? 'is-invalid' : ''}`}
                                    name="typeArret"
                                    value={formData.typeArret}
                                    onChange={handleInputChange}
                                >
                                    <option value="">_</option>
                                    <option value="exterieur">Exterieur</option>
                                    <option value="materiel">Materiel</option>
                                    <option value="exploitation">Exploitation</option>
                                    <option value="autre">Autre</option>
                                </select>
                                {errors.typeArret && <div className="invalid-feedback">{errors.typeArret}</div>}
                            </td>

                            <td>
                                <select
                                    className={`form-control mx-1 ${errors.post ? 'is-invalid' : ''}`}
                                    name="post"
                                    value={formData.post}
                                    onChange={handleInputChange}
                                >
                                    <option value="">_</option>
                                    <option value="1er">1er</option>
                                    <option value="2eme">2eme</option>
                                    <option value="3eme">3eme</option>
                                </select>
                                {errors.post && <div className="invalid-feedback">{errors.post}</div>}
                            </td>

                            <td>
                                <input
                                    className={`form-control m-1 ${errors.df ? 'is-invalid' : ''}`}
                                    type="text"
                                    name="df"
                                    value={formData.df}
                                    onChange={handleInputChange}
                                />
                                {errors.df && <div className="invalid-feedback">{errors.df}</div>}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button className="btn btn-primary mb-5" type="submit">Add to Table</button>
            </form>
        </div>
    );
};

export default Formtest;
