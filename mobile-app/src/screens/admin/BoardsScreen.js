import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { boardAPI } from '../../services/api';

export default function BoardsScreen() {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBoards = async () => {
        try {
            const res = await boardAPI.getAll();
            setBoards(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch boards');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBoards();
    };

    const renderItem = ({ item }) => (
        <View className="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700 flex-row justify-between items-center">
            <View>
                <Text className="text-white font-bold text-lg">{item.name}</Text>
                <Text className="text-slate-400 text-sm">{item.type}</Text>
            </View>
            <View className="flex-row">
                <TouchableOpacity onPress={() => Alert.alert('Info', 'Edit functionality coming soon')} className="mr-3">
                    <MaterialIcons name="edit" size={22} color="#818cf8" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-900 p-4">
            <FlatList
                data={boards}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
                ListEmptyComponent={<Text className="text-slate-500 text-center mt-10">No academic boards found</Text>}
            />
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-indigo-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-indigo-500/50"
                onPress={() => Alert.alert('Info', 'Add functionality coming soon')}
            >
                <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
