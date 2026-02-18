import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Selector({ label, value, options, onSelect, placeholder = "Select" }) {
    const [visible, setVisible] = useState(false);

    const selectedOption = options.find(o => o.value === value);

    return (
        <View className="mb-4">
            <Text className="text-slate-400 mb-1 text-xs uppercase font-bold">{label}</Text>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex-row justify-between items-center"
            >
                <Text className={selectedOption ? "text-white" : "text-slate-500"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#94a3b8" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide">
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-slate-900 rounded-t-3xl h-[50%] p-5 border-t border-slate-700">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-lg font-bold">{label}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`p-4 rounded-xl mb-2 ${item.value === value ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                    onPress={() => { onSelect(item.value); setVisible(false); }}
                                >
                                    <Text className="text-white font-medium">{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
