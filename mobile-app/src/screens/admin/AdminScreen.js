import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ModuleButton = ({ title, subtitle, icon, onPress }) => (
    <TouchableOpacity
        className="flex-row items-center bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700"
        onPress={onPress}
    >
        <View className="w-12 h-12 rounded-full bg-indigo-500/20 items-center justify-center mr-4">
            {icon}
        </View>
        <View className="flex-1">
            <Text className="text-white font-semibold text-lg">{title}</Text>
            <Text className="text-slate-400 text-xs">{subtitle}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
    </TouchableOpacity>
);

export default function AdminScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView className="flex-1 bg-slate-900 p-4">
            <Text className="text-sm text-indigo-400 font-bold uppercase tracking-wider mb-4">Configuration</Text>

            <ModuleButton
                title="Schools"
                subtitle="Manage schools list"
                icon={<FontAwesome5 name="school" size={20} color="#60a5fa" />}
                onPress={() => navigation.navigate('Schools')}
            />
            <ModuleButton
                title="Academic Boards"
                subtitle="Manage boards (CBSE, State, etc.)"
                icon={<MaterialIcons name="account-balance" size={24} color="#f472b6" />}
                onPress={() => navigation.navigate('Boards')}
            />
            <ModuleButton
                title="Classes"
                subtitle="Manage classes and sections"
                icon={<MaterialIcons name="class" size={24} color="#34d399" />}
                onPress={() => navigation.navigate('Classes')}
            />
            <ModuleButton
                title="Subjects"
                subtitle="Manage subjects and max marks"
                icon={<MaterialIcons name="menu-book" size={24} color="#fbbf24" />}
                onPress={() => navigation.navigate('Subjects')}
            />
            <ModuleButton
                title="Exams"
                subtitle="Configure exam types"
                icon={<MaterialIcons name="assignment" size={24} color="#c084fc" />}
                onPress={() => navigation.navigate('Exams')}
            />
            <ModuleButton
                title="Grade Ranges"
                subtitle="Configure grading system"
                icon={<MaterialIcons name="grade" size={24} color="#f87171" />}
                onPress={() => alert('Coming Soon')}
            />
        </ScrollView>
    );
}
