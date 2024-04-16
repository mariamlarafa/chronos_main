import { frFR as coreFrFR } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/x-data-grid';
import { frFR as pickersFrFR } from '@mui/x-date-pickers/locales';

export const Theme = createTheme(
    {
    typography: {
        h1: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        h2: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        h3: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        h4: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        h5: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        h6: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        subtitle1: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        subtitle2: {
            fontFamily: 'MyriadPro,sans-serif',
            color:'#9B9A9A',
            fontWeight:300
        },
        body1: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        body2: {
            fontFamily: 'MyriadPro,sans-serif'
        },
        button:{
            fontFamily: 'MyriadPro,sans-serif'
        },

    },
    palette: {
        //yellowish
        primary: {
            main: '#17917f'
        },
        //blueish
        secondary: {
            main: '#e76009'
        },
        //greenish
        info: {
            main: '#FCF7F8'
        },
        //orange xs
        warning: {
            main: '#ffa700'
        }

    }
},
frFR, // x-data-grid translations
pickersFrFR, // x-date-pickers translations
coreFrFR, // core translations
)