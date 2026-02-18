import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import AdminScreen from './src/screens/admin/AdminScreen';
import SchoolsScreen from './src/screens/admin/SchoolsScreen';
import BoardsScreen from './src/screens/admin/BoardsScreen';
import ClassesScreen from './src/screens/admin/ClassesScreen';
import SubjectsScreen from './src/screens/admin/SubjectsScreen';
import ExamsScreen from './src/screens/admin/ExamsScreen';
import MarksEntryScreen from './src/screens/MarksEntryScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" backgroundColor="#0f172a" />
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: '#0f172a' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                        contentStyle: { backgroundColor: '#0f172a' },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{ title: 'School Management' }}
                    />
                    <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Config' }} />
                    <Stack.Screen name="Schools" component={SchoolsScreen} options={{ title: 'Manage Schools' }} />
                    <Stack.Screen name="Boards" component={BoardsScreen} options={{ title: 'Academic Boards' }} />
                    <Stack.Screen name="Classes" component={ClassesScreen} options={{ title: 'Manage Classes' }} />
                    <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Manage Subjects' }} />
                    <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Manage Exams' }} />
                    <Stack.Screen name="MarksEntry" component={MarksEntryScreen} options={{ title: 'Enter Marks' }} />
                    <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Student Reports' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
