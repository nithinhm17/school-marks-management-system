import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { schoolAPI, classAPI, studentAPI } from '../services/api';

const DashboardTile = ({ title, count, icon, color, onPress }) => (
    <TouchableOpacity
        className={`w-[48%] p-4 rounded-xl mb-4 bg-slate-800 border-l-4 ${color}`}
        onPress={onPress}
    >
        <View className="flex-row justify-between items-start">
            <View className={`w-10 h-10 rounded-full items-center justify-center bg-slate-700`}>
                {icon}
            </View>
            <Text className="text-2xl font-bold text-white">{count}</Text>
        </View>
        <Text className="text-slate-400 mt-2 font-medium">{title}</Text>
    </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
    <Text className="text-lg font-bold text-slate-200 mt-6 mb-3 border-b border-slate-700 pb-2">{title}</Text>
);

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

export default function DashboardScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ schools: 0, classes: 0, students: 0 });
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const [s, c, st] = await Promise.all([
                schoolAPI.getAll(),
                classAPI.getAll(),
                studentAPI.getAll({})
            ]);
            setStats({
                schools: s.data?.length || 0,
                classes: c.data?.length || 0,
                students: st.data?.length || 0
            });
        } catch (error) {
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-slate-900 p-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
            <View className="mb-6">
                <Text className="text-sm text-indigo-400 font-bold uppercase tracking-wider">Overview</Text>
                <Text className="text-2xl font-bold text-white">System Stats</Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
                <DashboardTile
                    title="Total Schools"
                    count={stats.schools}
                    icon={<FontAwesome5 name="school" size={18} color="#60a5fa" />}
                    color="border-blue-400"
                />
                <DashboardTile
                    title="Total Classes"
                    count={stats.classes}
                    icon={<MaterialIcons name="class" size={22} color="#34d399" />}
                    color="border-emerald-400"
                />
                <DashboardTile
                    title="Total Students"
                    count={stats.students}
                    icon={<FontAwesome5 name="user-graduate" size={18} color="#a78bfa" />}
                    color="border-purple-400"
                />
                <DashboardTile
                    title="Exams Configured"
                    count="-"
                    icon={<MaterialIcons name="assignment" size={22} color="#f59e0b" />}
                    color="border-amber-400"
                />
            </View>

            <SectionHeader title="Modules" />

            <ModuleButton
                title="Admin Configuration"
                subtitle="Manage schools, classes, subjects"
                icon={<MaterialIcons name="admin-panel-settings" size={24} color="#818cf8" />}
                onPress={() => navigation.navigate('Admin')}
            />

            <ModuleButton
                title="Marks Entry"
                subtitle="Teacher interface for entering marks"
                icon={<MaterialIcons name="edit" size={24} color="#34d399" />}
                onPress={() => navigation.navigate('MarksEntry')}
            />

            <ModuleButton
                title="Student Reports"
                subtitle="View report cards and analytics"
                icon={<MaterialIcons name="analytics" size={24} color="#f472b6" />}
                onPress={() => navigation.navigate('Reports')}
            />

        </ScrollView>
    );
}
