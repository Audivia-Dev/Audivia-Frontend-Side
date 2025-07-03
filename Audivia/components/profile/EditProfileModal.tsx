import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { User } from '@/models';
import { getCountryList, updateUserInfo } from '@/services/user';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
  user: User;
}

const JOB_OPTIONS = [
  "Học sinh/Sinh viên",
  "Kinh doanh/Quản lý",
  "Văn phòng/Hành chính",
  "Công nghệ thông tin (IT)",
  "Marketing/Truyền thông",
  "Tài chính/Kế toán",
  "Giáo dục/Đào tạo",
  "Y tế/Dược phẩm",
  "Xây dựng/Kỹ thuật",
  "Du lịch/Khách sạn",
  "Nghệ thuật/Sáng tạo",
  "Lao động phổ thông",
  "Nghỉ hưu",
  "Nội trợ",
  "Khác"
];

const formatToDDMMYYYY = (date?: Date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function EditProfileModal({ visible, onClose, onUpdated, user }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(user.birthDay ? new Date(user.birthDay) : undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<boolean>(user.gender ?? false); // false: Nam, true: Nữ
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [job, setJob] = useState(user.job || '');
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [country, setCountry] = useState(user.country || '');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(user.fullName);
    setPhone(user.phone);
    setBio(user.bio);
    setDateOfBirth(user.birthDay ? new Date(user.birthDay) : undefined);
    setGender(user.gender ?? false);
    setJob(user.job || '');
    setCountry(user.country || '');
  }, [user]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const fetchedCountries = await getCountryList();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        Alert.alert('Lỗi', 'Không thể tải danh sách quốc gia.');
      }
    };
    if (visible && countries.length === 0) { // Only fetch if visible and countries not already loaded
      fetchCountries();
    }
  }, [visible, countries.length]);

  const handleSave = async () => {
    if (!fullName || !phone) {
      Alert.alert('Lỗi', 'Tên đầy đủ và số điện thoại không được để trống.');
      return;
    }
    setLoading(true);
    try {
      const birthDay = dateOfBirth ? dateOfBirth.toISOString().slice(0, 10) : undefined;
      const updatedUser = {
        fullName,
        phone,
        bio,
        gender,
        job,
        country,
        birthDay,
      };
      const response = await updateUserInfo(user.id, updatedUser);
      if (response.success) {
        Alert.alert('Thành công', 'Cập nhật thông tin cá nhân thành công.');
        onUpdated();
        onClose();
      } else {
        throw new Error(response.message || 'Không thể cập nhật thông tin cá nhân.');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên đầy đủ</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập tên đầy đủ của bạn"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại của bạn"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tiểu sử</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Viết vài dòng về bản thân..."
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày sinh</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>
                  {dateOfBirth ? formatToDDMMYYYY(dateOfBirth) : 'Chọn ngày sinh'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Giới tính</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{gender ? 'Nữ' : 'Nam'}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nghề nghiệp</Text>
              <TouchableOpacity onPress={() => setShowJobPicker(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{job || 'Chọn nghề nghiệp'}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Quốc gia</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(true)} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{country || 'Chọn quốc gia'}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.grey} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              <Text style={styles.saveButtonText}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.genderPickerModalContent}>
            <Text style={styles.modalTitle}>Chọn giới tính</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => {
                  setGender(true);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.genderOptionText}>Nữ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => {
                  setGender(false);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.genderOptionText}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderOption, { marginTop: 10, backgroundColor: COLORS.lightGrey }]}
                onPress={() => setShowGenderPicker(false)}
              >
                <Text style={[styles.genderOptionText, { color: COLORS.dark }]}>Hủy</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showJobPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowJobPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.jobPickerModalContent}>
            <Text style={styles.modalTitle}>Chọn nghề nghiệp</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {JOB_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.jobOption}
                  onPress={() => {
                    setJob(option);
                    setShowJobPicker(false);
                  }}
                >
                  <Text style={styles.jobOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.jobOption, { marginTop: 10, backgroundColor: COLORS.lightGrey }]}
                onPress={() => setShowJobPicker(false)}
              >
                <Text style={[styles.jobOptionText, { color: COLORS.dark }]}>Hủy</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.countryPickerModalContent}>
            <Text style={styles.modalTitle}>Chọn quốc gia</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {countries.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.countryOption}
                  onPress={() => {
                    setCountry(option);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.countryOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.countryOption, { marginTop: 10, backgroundColor: COLORS.lightGrey }]}
                onPress={() => setShowCountryPicker(false)}
              >
                <Text style={[styles.countryOptionText, { color: COLORS.dark }]}>Hủy</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: COLORS.dark,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  genderPickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%', // Thêm để giới hạn chiều cao và cho phép cuộn
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    alignItems: 'center',
  },
  genderOptionText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  jobPickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%', // Thêm để giới hạn chiều cao và cho phép cuộn
  },
  jobOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    alignItems: 'center',
  },
  jobOptionText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  countryPickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%', // Thêm để giới hạn chiều cao và cho phép cuộn
  },
  countryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    alignItems: 'center',
  },
  countryOptionText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 