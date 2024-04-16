// export const SUPERUSER_ROLE= 'superuser';
// export const EMPLOYEE_ROLE= 'employee';
// export const CLIENT_ROLE= 'client';
export const SUPERUSER_ROLE='superuser'

export const INTERVENANT_ROLE='intervenant '
export const PROJECT_MANAGER_ROLE='Chef_projet'
export const CLIENT_ROLE='client'
export const ALL_ROLES=[
    SUPERUSER_ROLE,
    INTERVENANT_ROLE,
    PROJECT_MANAGER_ROLE,
    CLIENT_ROLE

]





export const FILE_TYPE_PATH ='./uploads/files'
export const IMAGE_TYPE_PATH='./uploads/images'
export const PROJECT_PHASE_STATUS_IN_PROGRESS='in_progress'
export const PROJECT_PHASE_STATUS_BLOCKED='blocked'
export const PROJECT_PHASE_STATUS_COMPLETED='completed'


export const STATE_DOING = "doing";
export const STATE_DONE = "done";
export const STATE_ABANDONED = "abandoned";
export const STATE_BLOCKED = "blocked";
export const TASK_STATES = [
  STATE_DOING,
  STATE_DONE,
  STATE_ABANDONED,
  STATE_BLOCKED
];

export const REQUEST_STATE_TREATED  ='treated'
export const REQUEST_STATE_NOON_TREATED  ='not-treated'


export const TASK_STATE_TRANSLATION =[
    {
    value:STATE_DOING,
    label:'En cours',
},
    {
    value:STATE_DONE,
    label:'Terminé',
},
    {
    value:STATE_ABANDONED,
    label:'Abandonné',
},
    {
    value:STATE_BLOCKED,
    label:'Bloqué',
},
]



export const REQUEST_STATES_VALUES=[true,false]
export const REQUEST_STATES_TREATED="traité"
export const REQUEST_STATES_NOT_TREATED="non traité"
export const REQUEST_STATES_LABELS=["traité","non traité"]

export const REQUEST_STATE_TRANSLATION =[
  {
  value:false,
  label:REQUEST_STATES_NOT_TREATED,
},
  {
  value:true,
  label:REQUEST_STATES_TREATED,
},
]


export const ACTION_NAME_PROJECT_CREATION  ="PROJECT_CREATION"
export const ACTION_NAME_TASK_CREATION  ="TASK_CREATION"
export const ACTION_NAME_REQUEST_CREATION  ="REQUEST_CREATION"
export const ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT  ="ADD_INTERVENANTS_BULK_PROJECT"
export const ACTION_NAME_ADD_INTERVENANT_PROJECT  ="ADD_INTERVENANT_PROJECT"
export const ACTION_NAME_DELETE_INTERVENANT  ="DELETE_INTERVENANT"
export const ACTION_NAME_ADD_PROJECT_MANAGER  ="ADD_PROJECT_MANAGER"
export const ACTION_NAME_CHANGE_PROJECT_MANAGER  ="CHANGE_PROJECT_MANAGER"
export const ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS  ="ASSIGN_PROJECT_MANAGER_HOURS"
export const ACTION_NAME_ASSIGN_INTERVENANT_HOURS  ="ASSIGN_INTERVENANT_HOURS"
export const ACTION_NAME_PROJECT_UPDATE  ="PROJECT_UPDATE"
export const ACTION_NAME_TASK_UPDATE  ="TASK_UPDATE"
export const ACTION_NAME_REQUEST_UPDATE  ="REQUEST_UPDATE"
export const ACTION_NAME_VERIFY_TASK  ="VERIFY_TASK"
export const ACTION_NAME_TASK_STATE_CHANGED  ="TASK_STATE_CHANGED"
export const ACTION_NAME_REQUEST_STATE_CHANGED  ="REQUEST_STATE_CHANGED"
export const ACTION_NAME_ADMIN_REQUEST_DELETE  ="ADMIN_REQUEST_DELETE"
export const ACTION_NAME_ADD_INTERVENANTS_BULK_TASK  ="ADD_INTERVENANTS_BULK_TASK"
export const ACTION_NAME_ADD_INTERVENANT_TASK  ="ADD_INTERVENANT_TASK"
export const ACTION_NAME_INTERVENANT_JOINED_TASK  ="INTERVENANT_JOINED_TASK"
export const ACTION_NAME_PROJECT_UPDATE_MANAGER  ="PROJECT_UPDATE_MANAGER"



export const ACTION_NAME_PROJECT_CREATION_FR = "Création de Projet";
export const ACTION_NAME_TASK_CREATION_FR = "Création de Tâche";
export const ACTION_NAME_REQUEST_CREATION_FR = "Création de Demande";
export const ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT_FR = "Ajout d'Intervenants en Masse - Projet";
export const ACTION_NAME_ADD_INTERVENANT_PROJECT_FR = "Ajout d'Intervenant - Projet";
export const ACTION_NAME_DELETE_INTERVENANT_FR = "Suppression d'Intervenant";
export const ACTION_NAME_ADD_PROJECT_MANAGER_FR = "Ajout de Gestionnaire - Projet";
export const ACTION_NAME_CHANGE_PROJECT_MANAGER_FR = "Modification de Gestionnaire - Projet";
export const ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS_FR = "Attribution d'Heures - Gestionnaire - Projet";
export const ACTION_NAME_ASSIGN_INTERVENANT_HOURS_FR = "Attribution d'Heures - Intervenant";
export const ACTION_NAME_PROJECT_UPDATE_FR = "Mise à Jour de Projet";
export const ACTION_NAME_TASK_UPDATE_FR = "Mise à Jour de Tâche";
export const ACTION_NAME_REQUEST_UPDATE_FR = "Mise à Jour de Demande";
export const ACTION_NAME_VERIFY_TASK_FR = "Vérification de Tâche";
export const ACTION_NAME_TASK_STATE_CHANGED_FR = "Changement d'État de Tâche";
export const ACTION_NAME_REQUEST_STATE_CHANGED_FR = "Changement d'État de Demande";
export const ACTION_NAME_ADMIN_REQUEST_DELETE_FR = "Suppression de Demande par Admin";
export const ACTION_NAME_ADD_INTERVENANTS_BULK_TASK_FR = "Ajout d'Intervenants en Masse - Tâche";
export const ACTION_NAME_ADD_INTERVENANT_TASK_FR = "Ajout d'Intervenant - Tâche";
export const ACTION_NAME_INTERVENANT_JOINED_TASK_FR = "Intervenant Rejoint Tâche";
export const ACTION_NAME_PROJECT_UPDATE_MANAGER_FR = "Mise à Jour de Gestionnaire - Projet";



export const action_titles_fr = {
   100: ACTION_NAME_PROJECT_CREATION_FR ,
   101: ACTION_NAME_TASK_CREATION_FR ,
   102: ACTION_NAME_REQUEST_CREATION_FR ,
   103: ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT_FR ,
   104: ACTION_NAME_ADD_INTERVENANT_PROJECT_FR ,
   105: ACTION_NAME_DELETE_INTERVENANT_FR ,
   106: ACTION_NAME_ADD_PROJECT_MANAGER_FR ,
   107: ACTION_NAME_CHANGE_PROJECT_MANAGER_FR ,
   108: ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS_FR ,
   109: ACTION_NAME_ASSIGN_INTERVENANT_HOURS_FR ,
   110: ACTION_NAME_PROJECT_UPDATE_FR ,
   111: ACTION_NAME_TASK_UPDATE_FR ,
   112: ACTION_NAME_REQUEST_UPDATE_FR ,
   113: ACTION_NAME_VERIFY_TASK_FR ,
   114: ACTION_NAME_TASK_STATE_CHANGED_FR ,
   115: ACTION_NAME_REQUEST_STATE_CHANGED_FR ,
   116: ACTION_NAME_ADMIN_REQUEST_DELETE_FR ,
   117: ACTION_NAME_ADD_INTERVENANTS_BULK_TASK_FR ,
   118: ACTION_NAME_ADD_INTERVENANT_TASK_FR ,
   119: ACTION_NAME_INTERVENANT_JOINED_TASK_FR ,
   120: ACTION_NAME_PROJECT_UPDATE_MANAGER_FR ,
}


export const action_codes =[
  { code:100,action:ACTION_NAME_PROJECT_CREATION,},
  { code:101,action:ACTION_NAME_TASK_CREATION,},
  { code:102,action:ACTION_NAME_REQUEST_CREATION,},
  { code:103,action:ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,},
  { code:104,action:ACTION_NAME_ADD_INTERVENANT_PROJECT,},
  { code:105,action:ACTION_NAME_DELETE_INTERVENANT,},
  { code:106,action:ACTION_NAME_ADD_PROJECT_MANAGER,},
  { code:107,action:ACTION_NAME_CHANGE_PROJECT_MANAGER,}, // not implemented
  { code:108,action:ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,},
  { code:109,action:ACTION_NAME_ASSIGN_INTERVENANT_HOURS,},
  { code:110,action:ACTION_NAME_PROJECT_UPDATE,},
  { code:111,action:ACTION_NAME_TASK_UPDATE,},
  { code:112,action:ACTION_NAME_REQUEST_UPDATE,},
  { code:113,action:ACTION_NAME_VERIFY_TASK,},
  { code:114,action:ACTION_NAME_TASK_STATE_CHANGED,},
  { code:115,action:ACTION_NAME_REQUEST_STATE_CHANGED,},
  { code:116,action:ACTION_NAME_ADMIN_REQUEST_DELETE,},
  { code:117,action:ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,},
  { code:118,action:ACTION_NAME_ADD_INTERVENANT_TASK,},
  { code:119,action:ACTION_NAME_INTERVENANT_JOINED_TASK,},
  { code:120,action:ACTION_NAME_PROJECT_UPDATE_MANAGER,},

]


export const action_phrases = {
  100: (attributes) => ` ${attributes.email} a créé le projet.`,
  101: (attributes) => ` ${attributes.email} a créé la tâche: ${attributes.taskName}.`,
  102: (attributes) => ` ${attributes.email} a créé une requete: ${attributes.requestName}.`,
  103: (attributes) => ` ${attributes.email} a ajouté ${attributes.intervenantsNames} comme des intervenants au projet`,
  104: (attributes) => ` ${attributes.email} a ajouté ${attributes.intervenantsNames} comme un intervenant au projet.`,
  105: (attributes) => ` ${attributes.email} a supprimé l'intervenant ${attributes.deletedIntervenant} du projet.`,
  106: (attributes) => ` ${attributes.email} a ajouté  ${attributes.managerEmail} comme un chef de projet.`,
  107: (attributes) => ` ${attributes.email} a changé le chef de projet.`,
  108: (attributes) => `chef de projet ${attributes.email} a remplis ${attributes.hours} heures.`,
  109: (attributes) => ` ${attributes.email}  a renseigner ${attributes.hours} heurs de travail le ${attributes.date} dans la tache ${attributes.taskName}`,
  110: (attributes) => ` ${attributes.email} a changé les details du projet de ${attributes.oldValues} vers ${attributes.newValues}`,
  111: (attributes) => ` ${attributes.email} a mis à jour la tache ${attributes.taskName} de ${attributes.oldValues} vers ${attributes.newValues}. `,
  112: (attributes) => ` ${attributes.email} a mis à jour la requete  ${attributes.requestName} de ${attributes.oldValues} vers ${attributes.newValues}.`,
  113: (attributes) => ` ${attributes.email} a vérifié une tâche avec l'ID ${attributes.taskName}.`,
  114: (attributes) => ` ${attributes.email} a changé l'état du tache tâche ${attributes.taskName} de ${attributes.oldState} vers ${attributes.newState}.`,
  115: (attributes) => ` ${attributes.email} a marqué la requete ${attributes.requestName} comme ${attributes.state}.`,
  116: (attributes) => `l'administrateur a supprimé la requête  ${attributes.requestName}.`,
  117: (attributes) => ` ${attributes.email} a ajouté ${attributes.intervenantsNames} comme des intervenants au tache ${attributes.taskName}.`,
  118: (attributes) => ` ${attributes.email} a ajouté ${attributes.intervenantsNames} comme un intervenant au tache ${attributes.taskName}.`,
  119: (attributes) => ` ${attributes.email} a rejoint la tache ${attributes.taskName}.`,
  120: (attributes) => ` ${attributes.email} a changer le chef de projet de ${attributes.oldManager} vers ${attributes.newManager} `,
};






export const actions_messages =[

]




export const actions_list =[
  ACTION_NAME_PROJECT_CREATION,
  ACTION_NAME_TASK_CREATION,
  ACTION_NAME_REQUEST_CREATION,
  ACTION_NAME_DELETE_INTERVENANT,
  ACTION_NAME_ADD_PROJECT_MANAGER,
  ACTION_NAME_CHANGE_PROJECT_MANAGER,
  ACTION_NAME_ASSIGN_PROJECT_MANAGER_HOURS,
  ACTION_NAME_ASSIGN_INTERVENANT_HOURS,
  ACTION_NAME_PROJECT_UPDATE,
  ACTION_NAME_TASK_UPDATE,
  ACTION_NAME_REQUEST_UPDATE,
  ACTION_NAME_VERIFY_TASK,
  ACTION_NAME_TASK_STATE_CHANGED,
  ACTION_NAME_REQUEST_STATE_CHANGED,
  ACTION_NAME_ADD_INTERVENANTS_BULK_PROJECT,
ACTION_NAME_ADD_INTERVENANT_PROJECT,
ACTION_NAME_ADD_INTERVENANTS_BULK_TASK,
ACTION_NAME_ADD_INTERVENANT_TASK,
ACTION_NAME_INTERVENANT_JOINED_TASK,
ACTION_NAME_PROJECT_UPDATE_MANAGER
]



