import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { classAPI, examAPI, subjectAPI, studentAPI, marksAPI } from '../services/api';
import Selector from '../components/Selector';
import { MaterialIcons } from '@expo/vector-icons';

export default function MarksEntryScreen() {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    const [selClass, setSelClass] = useState('');
    const [selExam, setSelExam] = useState('');
    const [selSubject, setSelSubject] = useState('');

    const [marksData, setMarksData] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        classAPI.getAll().then(r => setClasses(r.data.map(c => ({ label: `${c.name} ${c.section || ''}`, value: c._id }))));
    }, []);

    useEffect(() => {
        if (selClass) {
            examAPI.getAll(selClass).then(r => setExams(r.data.map(e => ({ label: e.name, value: e._id }))));
            subjectAPI.getAll(selClass).then(r => setSubjects(r.data.map(s => ({ label: `${s.name} (Max: ${s.maxMarks})`, value: s._id, max: s.maxMarks }))));
            setSelExam('');
            setSelSubject('');
        }
    }, [selClass]);

    const fetchStudentsAndMarks = async () => {
        if (!selClass || !selExam || !selSubject) return;
        setLoading(true);
        try {
            const [sRes, mRes] = await Promise.all([
                studentAPI.getAll({ class: selClass }),
                marksAPI.getAll({ class: selClass, exam: selExam, subject: selSubject })
            ]);
            setStudents(sRes.data);

            const existingMarks = {};
            mRes.data.forEach(m => {
                existingMarks[m.student._id] = m.marksObtained.toString();
            });
            setMarksData(existingMarks);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentsAndMarks();
    }, [selClass, selExam, selSubject]);

    const handleMarkChange = (studentId, value) => {
        setMarksData(prev => ({ ...prev, [studentId]: value }));
    };

    const saveMarks = async () => {
        if (!selClass || !selExam || !selSubject) {
            Alert.alert('Missing Selection', 'Please select Class, Exam, and Subject first.');
            return;
        }

        setSubmitting(true);
        const marksToSave = students.map(s => ({
            student: s._id,
            class: selClass,
            exam: selExam,
            subject: selSubject,
            marksObtained: parseFloat(marksData[s._id]) || 0,
            maxMarks: subjects.find(sub => sub.value === selSubject)?.max || 100
        })).filter(m => marksData[m.student] !== undefined && marksData[m.student] !== '');

        try {
            await marksAPI.bulkCreate(marksToSave);
            Alert.alert('Success', 'Marks saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save marks');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-900">
            <ScrollView className="flex-1 p-4">
                <View className="glass-card mb-4">
                    <Selector label="Class" value={selClass} options={classes} onSelect={setSelClass} placeholder="Select Class" />
                    <Selector label="Exam" value={selExam} options={exams} onSelect={setSelExam} placeholder="Select Exam" />
                    <Selector label="Subject" value={selSubject} options={subjects} onSelect={setSelSubject} placeholder="Select Subject" />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#34d399" className="my-10" />
                ) : (
                    students.length > 0 && selSubject && (
                        <View className="mb-20">
                            <Text className="text-white font-bold text-lg mb-4">Enter Marks</Text>
                            {students.map(student => (
                                <View key={student._id} className="bg-slate-800 p-4 rounded-xl mb-3 border border-slate-700 flex-row justify-between items-center">
                                    <View className="flex-1">
                                        <Text className="text-white font-bold">{student.name}</Text>
                                        <Text className="text-slate-400 text-xs">Roll: {student.rollNumber}</Text>
                                    </View>
                                    <TextInput
                                        className="bg-slate-900 text-white border border-slate-600 rounded-lg w-20 p-2 text-center"
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#64748b"
                                        value={marksData[student._id] || ''}
                                        onChangeText={(val) => handleMarkChange(student._id, val)}
                                    />
                                </View>
                            ))}
                        </View>
                    )
                )}
            </ScrollView>

            {students.length > 0 && selSubject && (
                <View className="absolute bottom-0 w-full p-4 bg-slate-900 border-t border-slate-800">
                    <TouchableOpacity
                        className={`bg-emerald-500 p-4 rounded-xl flex-row justify-center items-center ${submitting ? 'opacity-50' : ''}`}
                        onPress={saveMarks}
                        disabled={submitting}
                    >
                        {submitting && <ActivityIndicator size="small" color="white" className="mr-2" />}
                        <Text className="text-white font-bold text-lg">Save All Marks</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
