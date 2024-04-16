import React from "react";
import { leaveConfigurationStyles } from "./style";
import {Button, TextField} from "@mui/material";

function LeaveConfiguration() {
    const classes = leaveConfigurationStyles();

    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <span className={classes.spanT}>Bienvenue au configuration des congés,</span>
            </div>
            <div className={classes.contentSection}>
                <h3 style={{color: "orange"}}>La configuration des congé</h3>
                <div>
                    <b>Regime du congé:</b>
                    <input style={{color: 'green'}} type="radio" id="18jours" name="regimeConge"/>
                    <label htmlFor="18jours">18 jours</label>
                    <input type="radio" id="22jours" name="regimeConge"/>
                    <label htmlFor="22jours">22 jours</label>
                </div>

                <span style={{color: "orange"}}>Les types de congé:</span>
                <div>
                    <p>Congé maternité</p>
                    <TextField
                        label="Nombre de jours"
                        value="fdsqfd"
                    />
                </div>
                <div>
                    <p>Congé maladie obligation du depot de certificat</p>
                    <TextField
                        type={'radio'}
                        label="congeMaladie"
                        value="fdsqfd"
                    />
                    <label htmlFor="obligationDepot">Obligation du depot de certificat</label>
                    <div>
                        <TextField
                            label="Nombre de jours"
                            value=""
                        />
                        <TextField
                            label="Période de grâce"
                            value=""
                        />
                        <small style={{color: "green"}}>Le nombre de jours après la demande pour déposer le
                            certificat</small>
                    </div>
                </div>
                <hr/>
                <div>
                    <p>Congé Annuelle</p>
                    <Button variant="contained" color="primary">
                        Add new Remote Work
                    </Button>
                    <TextField
                        label="Nombre de jours"
                        value="fdsqfd"
                    />
                    <small>La substitution de la valeur du régime choisis et l'appliqué a tous les utilisateur</small>
                </div>
            </div>
        </div>
    );
}

export default LeaveConfiguration;
