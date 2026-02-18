import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { examAPI } from '../../services/api';

export default function ExamsScreen() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExams = async () => {
        try {
            const res = await examAPI.getAll();
            setExams(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch exams');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const onRefresh = () => fetchExams();

    const renderItem = ({ item }) => (
        <View className="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700">
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-bold text-lg">{item.name}</Text>
                <View className="bg-purple-500/20 px-2 py-1 rounded">
                    <Text className="text-purple-400 text-xs font-bold">{item.type}</Text>
                </View>
            </View>
            {item.academicSession && <Text className="text-slate-400 text-sm">Session: {item.academicSession}</Text>}
        </View>
    );

    return (
        <View className="flex-1 bg-slate-900 p-4">
            {loading ? (
                <ActivityIndicator size="large" color="#c084fc" className="mt-10" />
            ) : (
                <FlatList
                    data={exams}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
                    ListEmptyComponent={<Text className="text-slate-500 text-center mt-10">No exams found</Text>}
                />
            )}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-purple-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                onPress={() => Alert.alert('Info', 'Add Exam functionality coming soon')}
            >
                <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
