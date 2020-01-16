import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';


//Configurações da barra de Navegação
const Routes = createAppContainer(
    createStackNavigator({
        Main:{
            screen: Main,
            navigationOptions: {
                title: 'NerdFinder'
            },
        },
        Profile: {
            screen: Profile,
            title: 'Perfil no Github',
            headerBackTitleVisible: false,
        },
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#7d40e7',
            },
            headerTintColor: "#fff",
            headerTitleAlign: 'center',
        }
    }

    )
);

export default Routes;