import { useState, useEffect, useRef, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import { AppColors, AppSpacing, AppBorderRadius, AppFontSizes } from "@/constants/theme";

type RelayStatus = "connecting" | "ready" | "capturing" | "sent" | "error";

export default function RelayCaptureScreen() {
	const { ws } = useLocalSearchParams<{ ws: string }>();
	const [permission, requestPermission] = useCameraPermissions();
	const [status, setStatus] = useState<RelayStatus>("connecting");
	const [errorMessage, setErrorMessage] = useState("");
	const socketRef = useRef<WebSocket | null>(null);
	const cameraRef = useRef<CameraView>(null);

	useEffect(() => {
		if (!ws) {
			setStatus("error");
			setErrorMessage("No relay server address provided.");
			return;
		}

		const wsUrl = `ws://${ws}`;
		const socket = new WebSocket(wsUrl);
		socketRef.current = socket;

		socket.onopen = () => {
			setStatus("ready");
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data as string);
				if (data.status === "received") {
					setStatus("sent");
				}
			} catch {
				// Ignore non-JSON messages
			}
		};

		socket.onerror = () => {
			setStatus("error");
			setErrorMessage("Failed to connect to desktop relay server.");
		};

		socket.onclose = () => {
			if (status !== "sent" && status !== "error") {
				setStatus("error");
				setErrorMessage("Connection to desktop closed.");
			}
		};

		return () => {
			socket.close();
			socketRef.current = null;
		};
	}, [ws]);

	const capturePhoto = useCallback(async () => {
		if (!cameraRef.current || !socketRef.current) return;

		setStatus("capturing");

		try {
			const photo = await cameraRef.current.takePictureAsync({
				base64: true,
				quality: 0.85,
			});

			if (!photo?.base64 || !socketRef.current) {
				setStatus("error");
				setErrorMessage("Failed to capture photo.");
				return;
			}

			const dataUrl = `data:image/jpeg;base64,${photo.base64}`;
			socketRef.current.send(dataUrl);
			setStatus("sent");
		} catch (err) {
			setStatus("error");
			setErrorMessage(
				err instanceof Error ? err.message : "Capture failed."
			);
		}
	}, []);

	if (!permission) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size="large" color={AppColors.accent} />
			</SafeAreaView>
		);
	}

	if (!permission.granted) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.permissionCard}>
					<Text style={styles.title}>Camera Access Required</Text>
					<Text style={styles.subtitle}>
						The desktop needs your phone camera to verify your
						identity.
					</Text>
					<TouchableOpacity
						style={styles.primaryButton}
						onPress={requestPermission}
					>
						<Text style={styles.primaryButtonText}>
							Grant Camera Access
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Desktop Verification</Text>
				<Text style={styles.subtitle}>
					{status === "connecting" && "Connecting to desktop…"}
					{status === "ready" &&
						"Position your face and tap capture."}
					{status === "capturing" && "Capturing…"}
					{status === "sent" &&
						"Photo sent! Check the desktop for results."}
					{status === "error" && errorMessage}
				</Text>
			</View>

			<View style={styles.cameraContainer}>
				{status !== "sent" && status !== "error" ? (
					<CameraView
						ref={cameraRef}
						style={styles.camera}
						facing="front"
					>
						<View style={styles.faceGuide} />
					</CameraView>
				) : (
					<View style={styles.statusContainer}>
						{status === "sent" && (
							<>
								<Text style={styles.statusIcon}>✓</Text>
								<Text style={styles.statusText}>
									Photo sent successfully
								</Text>
							</>
						)}
						{status === "error" && (
							<>
								<Text style={styles.statusIcon}>✕</Text>
								<Text style={styles.statusText}>
									{errorMessage}
								</Text>
							</>
						)}
					</View>
				)}
			</View>

			<View style={styles.actions}>
				{status === "ready" && (
					<TouchableOpacity
						style={styles.captureButton}
						onPress={capturePhoto}
					>
						<View style={styles.captureInner} />
					</TouchableOpacity>
				)}

				{status === "capturing" && (
					<ActivityIndicator size="large" color={AppColors.accent} />
				)}

				{(status === "sent" || status === "error") && (
					<TouchableOpacity
						style={styles.primaryButton}
						onPress={() => router.back()}
					>
						<Text style={styles.primaryButtonText}>Done</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: AppColors.background,
	},
	header: {
		paddingHorizontal: AppSpacing.lg,
		paddingTop: AppSpacing.xl,
		paddingBottom: AppSpacing.md,
		alignItems: "center",
	},
	title: {
		fontSize: AppFontSizes.xl,
		fontWeight: "700",
		color: AppColors.textPrimary,
		marginBottom: AppSpacing.xs,
	},
	subtitle: {
		fontSize: AppFontSizes.sm,
		color: AppColors.textSecondary,
		textAlign: "center",
		lineHeight: 20,
	},
	cameraContainer: {
		flex: 1,
		marginHorizontal: AppSpacing.lg,
		borderRadius: AppBorderRadius.lg,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: AppColors.border,
	},
	camera: {
		flex: 1,
	},
	faceGuide: {
		position: "absolute",
		top: "15%",
		left: "20%",
		right: "20%",
		bottom: "25%",
		borderRadius: 120,
		borderWidth: 2,
		borderColor: "rgba(59, 130, 246, 0.5)",
		borderStyle: "dashed",
	},
	statusContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: AppColors.surface,
	},
	statusIcon: {
		fontSize: 56,
		marginBottom: AppSpacing.md,
		color: AppColors.accent,
	},
	statusText: {
		fontSize: AppFontSizes.md,
		color: AppColors.textSecondary,
		textAlign: "center",
		paddingHorizontal: AppSpacing.xl,
	},
	actions: {
		paddingVertical: AppSpacing.xl,
		alignItems: "center",
	},
	captureButton: {
		width: 72,
		height: 72,
		borderRadius: 36,
		borderWidth: 4,
		borderColor: AppColors.accent,
		justifyContent: "center",
		alignItems: "center",
	},
	captureInner: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: AppColors.accent,
	},
	primaryButton: {
		backgroundColor: AppColors.accent,
		paddingVertical: AppSpacing.md,
		paddingHorizontal: AppSpacing.xl,
		borderRadius: AppBorderRadius.md,
	},
	primaryButtonText: {
		fontSize: AppFontSizes.md,
		fontWeight: "600",
		color: AppColors.textPrimary,
	},
	permissionCard: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: AppSpacing.xl,
		gap: AppSpacing.md,
	},
});
