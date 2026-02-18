import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { studentAPI, resultsAPI } from '../services/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ReportsScreen() {
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Debounced search (simplified)
    useEffect(() => {
        if (search.length > 2) {
            const timer = setTimeout(() => {
                studentAPI.getAll({ search }).then(res => setStudents(res.data)).catch(console.error);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setStudents([]);
        }
    }, [search]);

    const fetchResult = async (student) => {
        setSelectedStudent(student);
        setLoading(true);
        setStudents([]); // Clear list
        setSearch(''); // Clear search logic but keep text? No, clear text to hide list
        try {
            const res = await resultsAPI.getStudentResult(student._id);
            setResult(res.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch result');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        if (!result || !selectedStudent) return;
        setGenerating(true);

        const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .school-name { font-size: 24px; font-weight: bold; color: #1e293b; }
            .title { font-size: 18px; color: #64748b; margin-top: 5px; }
            .student-info { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .summary { background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; color: white; display: inline-block; }
            .pass { background-color: #22c55e; }
            .fail { background-color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">${selectedStudent.school?.name || 'School Name'}</div>
            <div class="title">Student Report Card</div>
          </div>
          
          <div class="student-info">
            <div class="info-row">
              <strong>Name: ${selectedStudent.name}</strong>
              <strong>Roll No: ${selectedStudent.rollNumber}</strong>
            </div>
            <div class="info-row">
              <span>Class: ${selectedStudent.class?.name} ${selectedStudent.class?.section || ''}</span>
              <span>Date: ${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          ${result.examResults ? result.examResults.map(exam => `
            <h3>${exam.exam?.name} <span style="font-size:12px; font-weight:normal; color:#64748b">(${exam.percentage}%)</span></h3>
            <table>
              <thead><tr><th>Subject</th><th>Marks</th><th>Max</th><th>%</th><th>Grade</th></tr></thead>
              <tbody>
                ${exam.subjects.map(sub => `
                  <tr>
                    <td>${sub.subject?.name}</td>
                    <td>${sub.marksObtained}</td>
                    <td>${sub.maxMarks}</td>
                    <td>${sub.percentage}%</td>
                    <td><span class="badge ${sub.grade === 'F' ? 'fail' : 'pass'}">${sub.grade}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `).join('') : ''}

          <div class="summary">
            <h3>Overall Performance</h3>
            <div class="info-row">
              <span>Total Marks: <strong>${result.summary?.totalObtained}/${result.summary?.totalMax}</strong></span>
              <span>Percentage: <strong>${result.summary?.percentage}%</strong></span>
            </div>
            <div class="info-row" style="margin-top:10px">
              <span>Grade: <strong>${result.summary?.grade}</strong></span>
              <span>Rank: <strong>#${result.summary?.rank || '-'}</strong></span>
            </div>
          </div>
        </body>
      </html>
    `;

        try {
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-900 p-4">
            {/* Search Bar */}
            <View className="relative z-10">
                <View className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex-row items-center mb-2">
                    <MaterialIcons name="search" size={24} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-2 text-white"
                        placeholder="Search Student (Name or Roll No)"
                        placeholderTextColor="#64748b"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearch(''); setStudents([]); }}>
                            <MaterialIcons name="close" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Search Results Dropdown */}
                {students.length > 0 && (
                    <View className="absolute top-14 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 max-h-60">
                        <FlatList
                            data={students}
                            keyExtractor={s => s._id}
                            className="max-h-60"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-3 border-b border-slate-700 last:border-0"
                                    onPress={() => fetchResult(item)}
                                >
                                    <Text className="text-white font-bold">{item.name}</Text>
                                    <Text className="text-slate-400 text-xs">Roll: {item.rollNumber} • Class: {item.class?.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>

            {/* Result View */}
            {loading ? (
                <ActivityIndicator size="large" color="#f472b6" className="mt-20" />
            ) : result ? (
                <ScrollView className="flex-1 -z-0">
                    {/* Student Header */}
                    <View className="bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-700 items-center">
                        <View className="w-16 h-16 bg-pink-500/20 rounded-full items-center justify-center mb-3">
                            <Text className="text-pink-400 text-2xl font-bold">{selectedStudent.name.charAt(0)}</Text>
                        </View>
                        <Text className="text-white text-xl font-bold">{selectedStudent.name}</Text>
                        <Text className="text-slate-400">{selectedStudent.school?.name}</Text>
                        <View className="flex-row mt-3 gap-2">
                            <View className="bg-slate-700 px-3 py-1 rounded-full"><Text className="text-slate-300 text-xs">Class {selectedStudent.class?.name}</Text></View>
                            <View className="bg-slate-700 px-3 py-1 rounded-full"><Text className="text-slate-300 text-xs">Roll {selectedStudent.rollNumber}</Text></View>
                        </View>
                    </View>

                    {/* Overall Stats */}
                    <View className="flex-row justify-between mb-4">
                        <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-[48%] items-center">
                            <Text className="text-slate-400 text-xs uppercase">Overall %</Text>
                            <Text className="text-emerald-400 text-2xl font-black">{result.summary?.percentage}%</Text>
                        </View>
                        <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-[48%] items-center">
                            <Text className="text-slate-400 text-xs uppercase">Grade</Text>
                            <Text className="text-purple-400 text-2xl font-black">{result.summary?.grade}</Text>
                        </View>
                    </View>

                    {/* Exam Breakdown */}
                    {result.examResults?.map((exam, idx) => (
                        <View key={idx} className="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700">
                            <View className="flex-row justify-between mb-3 border-b border-slate-700 pb-2">
                                <Text className="text-white font-bold">{exam.exam?.name}</Text>
                                <Text className="text-indigo-400 font-bold">{exam.percentage}%</Text>
                            </View>
                            {exam.subjects.map((sub, sIdx) => (
                                <View key={sIdx} className="flex-row justify-between mb-2">
                                    <Text className="text-slate-300 flex-1">{sub.subject?.name}</Text>
                                    <Text className="text-white font-mono w-10 text-right">{sub.marksObtained}</Text>
                                    <Text className="text-slate-500 font-mono w-10 text-right">/{sub.maxMarks}</Text>
                                    <Text className={`w-8 text-right font-bold ${sub.grade === 'F' ? 'text-red-400' : 'text-emerald-400'}`}>{sub.grade}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    <TouchableOpacity
                        className="bg-pink-600 p-4 rounded-xl flex-row justify-center items-center mb-10"
                        onPress={generatePDF}
                        disabled={generating}
                    >
                        {generating ? <ActivityIndicator color="white" className="mr-2" /> : <MaterialIcons name="picture-as-pdf" size={20} color="white" style={{ marginRight: 8 }} />}
                        <Text className="text-white font-bold">Download PDF Report</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center -z-0">
                    <FontAwesome5 name="clipboard-list" size={48} color="#334155" />
                    <Text className="text-slate-500 mt-4 text-center">Search for a student{'\n'}to view their report card</Text>
                </View>
            )}
        </View>
    );
}
