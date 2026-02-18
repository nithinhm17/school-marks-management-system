import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { classAPI, schoolAPI } from '../../services/api';

export default function ClassesScreen() {
    const [classes, setClasses] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([classAPI.getAll(), schoolAPI.getAll()]);
            setClasses(cRes.data);
            setSchools(sRes.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch classes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => fetchData();

    const renderItem = ({ item }) => (
        <View className="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700">
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-bold text-lg">{item.name} {item.section && `- ${item.section}`}</Text>
                <MaterialIcons name="class" size={20} color="#34d399" />
            </View>
            <Text className="text-slate-400 text-sm">School: {item.school?.name}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-900 p-4">
            {loading ? (
                <ActivityIndicator size="large" color="#34d399" className="mt-10" />
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
                    ListEmptyComponent={<Text className="text-slate-500 text-center mt-10">No classes found</Text>}
                />
            )}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-emerald-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                onPress={() => Alert.alert('Info', 'Add Class functionality coming soon')}
            >
                <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
