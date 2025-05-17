import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message, ChatRoomMember } from '@/models';

const API_URL = 'https://audivia-backend.azurewebsites.net'; // Replace with your actual API URL 
class SignalRService {
    private connection: HubConnection | null = null;
    private messageCallbacks: ((message: Message) => void)[] = [];
    private typingCallbacks: ((data: { userId: string, chatRoomId: string, isTyping: boolean }) => void)[] = [];
    private userJoinedCallbacks: ((member: ChatRoomMember) => void)[] = [];
    private userLeftCallbacks: ((member: ChatRoomMember) => void)[] = [];
    private userUpdatedCallbacks: ((member: ChatRoomMember) => void)[] = [];
    private messageUpdatedCallbacks: ((message: Message) => void)[] = [];
    private messageDeletedCallbacks: ((message: Message) => void)[] = [];
    private connectionStateCallbacks: ((state: HubConnectionState) => void)[] = [];

    async startConnection() {
        try {
            this.connection = new HubConnectionBuilder()
                .withUrl(`${API_URL}/chatHub`)
                .withAutomaticReconnect()
                .build();

            await this.connection.start();
            console.log('SignalR Connected');
            this.notifyConnectionState(this.connection.state);

            this.setupEventHandlers();
        } catch (error) {
            console.error('SignalR Connection Error:', error);
            this.notifyConnectionState(HubConnectionState.Disconnected);
        }
    }

    // Kiểm tra trạng thái kết nối
    isConnected(): boolean {
        return this.connection?.state === HubConnectionState.Connected;
    }

    // Lấy trạng thái kết nối hiện tại
    getConnectionState(): HubConnectionState | null {
        return this.connection?.state || null;
    }

    // Đăng ký callback để lắng nghe thay đổi trạng thái kết nối
    onConnectionStateChange(callback: (state: HubConnectionState) => void) {
        this.connectionStateCallbacks.push(callback);
    }

    // Hủy đăng ký callback
    removeConnectionStateCallback(callback: (state: HubConnectionState) => void) {
        this.connectionStateCallbacks = this.connectionStateCallbacks.filter(cb => cb !== callback);
    }

    // Thông báo trạng thái kết nối đến tất cả callbacks
    private notifyConnectionState(state: HubConnectionState) {
        this.connectionStateCallbacks.forEach(callback => callback(state));
    }

    //client lắng nghe server
    private setupEventHandlers() {
        if (!this.connection) return;

        // Lắng nghe sự kiện kết nối bị đứt
        this.connection.onclose(() => {
            console.log('SignalR Connection Closed');
            this.notifyConnectionState(HubConnectionState.Disconnected);
        });

        // Lắng nghe sự kiện kết nối lại
        this.connection.onreconnecting(() => {
            console.log('SignalR Reconnecting...');
            this.notifyConnectionState(HubConnectionState.Reconnecting);
        });

        // Lắng nghe sự kiện kết nối lại thành công
        this.connection.onreconnected(() => {
            console.log('SignalR Reconnected');
            this.notifyConnectionState(HubConnectionState.Connected);
        });

        this.connection.on('ReceiveMessage', (message: Message) => {
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.connection.on('UserTyping', (data: { userId: string, chatRoomId: string, isTyping: boolean }) => {
            this.typingCallbacks.forEach(callback => callback(data));
        });

        this.connection.on('UserJoined', (member: ChatRoomMember) => {
            this.userJoinedCallbacks.forEach(callback => callback(member));
        });

        this.connection.on('UserLeft', (member: ChatRoomMember) => {
            this.userLeftCallbacks.forEach(callback => callback(member));
        });

        this.connection.on('UserUpdated', (member: ChatRoomMember) => {
            this.userUpdatedCallbacks.forEach(callback => callback(member));
        });

        this.connection.on('UpdateMessage', (message: Message) => {
            this.messageUpdatedCallbacks.forEach(callback => callback(message));
        });

        this.connection.on('DeleteMessage', (message: Message) => {
            this.messageDeletedCallbacks.forEach(callback => callback(message));
        });
    }

    // async sendTypingStatus(userId: string, chatRoomId: string, isTyping: boolean) {
    //     try {
    //         await this.connection?.invoke('SendTypingStatus', userId, chatRoomId, isTyping);
    //     } catch (error) {
    //         console.error('Error sending typing status:', error);
    //     }
    // }
//đăng kí callback
    onReceiveMessage(callback: (message: Message) => void) {
        this.messageCallbacks.push(callback);
    }

    onUserTyping(callback: (data: { userId: string, chatRoomId: string, isTyping: boolean }) => void) {
        this.typingCallbacks.push(callback);
    }

    onUserJoined(callback: (member: ChatRoomMember) => void) {
        this.userJoinedCallbacks.push(callback);
    }

    onUserLeft(callback: (member: ChatRoomMember) => void) {
        this.userLeftCallbacks.push(callback);
    }

    onUserUpdated(callback: (member: ChatRoomMember) => void) {
        this.userUpdatedCallbacks.push(callback);
    }

    onMessageUpdated(callback: (message: Message) => void) {
        this.messageUpdatedCallbacks.push(callback);
    }

    onMessageDeleted(callback: (message: Message) => void) {
        this.messageDeletedCallbacks.push(callback);
    }

    removeMessageCallback(callback: (message: Message) => void) {
        this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }

    removeTypingCallback(callback: (data: { userId: string, chatRoomId: string, isTyping: boolean }) => void) {
        this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    }

    removeUserJoinedCallback(callback: (member: ChatRoomMember) => void) {
        this.userJoinedCallbacks = this.userJoinedCallbacks.filter(cb => cb !== callback);
    }

    removeUserLeftCallback(callback: (member: ChatRoomMember) => void) {
        this.userLeftCallbacks = this.userLeftCallbacks.filter(cb => cb !== callback);
    }

    removeUserUpdatedCallback(callback: (member: ChatRoomMember) => void) {
        this.userUpdatedCallbacks = this.userUpdatedCallbacks.filter(cb => cb !== callback);
    }

    removeMessageUpdatedCallback(callback: (message: Message) => void) {
        this.messageUpdatedCallbacks = this.messageUpdatedCallbacks.filter(cb => cb !== callback);
    }

    removeMessageDeletedCallback(callback: (message: Message) => void) {
        this.messageDeletedCallbacks = this.messageDeletedCallbacks.filter(cb => cb !== callback);
    }

    async stopConnection() {
        try {
            await this.connection?.stop();
            this.connection = null;
        } catch (error) {
            console.error('Error stopping connection:', error);
        }
    }
    //phát realtime đến mọi client
    async sendMessage(message: Message) {
        try {
            await this.connection?.invoke('SendMessage', message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    async joinRoom(roomId: string) {
        try {
            await this.connection?.invoke('JoinRoom', roomId);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    }

    async leaveRoom(roomId: string) {
        try {
            await this.connection?.invoke('LeaveRoom', roomId);
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    }
}

export const signalRService = new SignalRService(); 