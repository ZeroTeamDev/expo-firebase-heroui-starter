/**
 * UI Components Example Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortDirection,
  DataList,
  DataCard,
  DataGrid,
  EmptyState,
} from '@/components/data';
import {
  FormButton,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormFileUpload,
  FormSwitch,
  FormCheckbox,
  FormRadio,
  FormTextarea,
  type DateRangeValue,
  type SelectedFile,
} from '@/components/forms';
import {
  Breadcrumbs,
  Pagination as NavigationPagination,
  Stepper,
  Tabs,
  type StepItem,
  type TabItem,
} from '@/components/navigation';
import {
  MediaImage,
  MediaVideo,
  MediaAudio,
  MediaImageGallery,
  type MediaGalleryItem,
} from '@/components/media';
import { Alert, Badge, Progress, Spinner, ToastProvider, useToast } from '@/components/feedback';
import { IconSymbol } from '@/components/ui/icon-symbol';

type UserRow = {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'Active' | 'Invited' | 'Offline';
  score: number;
  lastActive: string;
};

const USER_ROWS: UserRow[] = [
  { id: 'u1', name: 'Alexa Rivers', role: 'Product Manager', location: 'San Francisco', status: 'Active', score: 92, lastActive: '2h ago' },
  { id: 'u2', name: 'Noah Bennett', role: 'Staff Engineer', location: 'Remote - UK', status: 'Active', score: 88, lastActive: '45m ago' },
  { id: 'u3', name: 'Ava Morales', role: 'Design Lead', location: 'Austin', status: 'Offline', score: 81, lastActive: 'Yesterday' },
  { id: 'u4', name: 'Liam Patel', role: 'AI Researcher', location: 'Toronto', status: 'Active', score: 95, lastActive: '5m ago' },
  { id: 'u5', name: 'Zoey Chen', role: 'Growth Analyst', location: 'Singapore', status: 'Invited', score: 74, lastActive: '—' },
  { id: 'u6', name: 'Ethan Cruz', role: 'Solutions Architect', location: 'Berlin', status: 'Active', score: 86, lastActive: '1h ago' },
  { id: 'u7', name: 'Harper Singh', role: 'Support Lead', location: 'Sydney', status: 'Offline', score: 78, lastActive: '3d ago' },
  { id: 'u8', name: 'Noelle Grant', role: 'Marketing Ops', location: 'New York', status: 'Active', score: 90, lastActive: '10m ago' },
  { id: 'u9', name: 'Mateo Rossi', role: 'Finance Partner', location: 'Milan', status: 'Active', score: 83, lastActive: '4h ago' },
  { id: 'u10', name: 'Isla Thompson', role: 'Customer Success', location: 'Chicago', status: 'Invited', score: 72, lastActive: '—' },
];

type ActivityItem = {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
};

const ACTIVITY: ActivityItem[] = [
  { id: 'a1', title: 'Product launch retro', summary: 'Team completed retro with 18 action items.', timestamp: 'Today · 14:02' },
  { id: 'a2', title: 'New leads imported', summary: '240 new qualified leads synced from HubSpot.', timestamp: 'Today · 11:47' },
  { id: 'a3', title: 'AI quality score', summary: 'Model v4.2 health score improved by 6%.', timestamp: 'Yesterday · 19:33' },
  { id: 'a4', title: 'Support satisfaction', summary: 'CSAT rolling average now 4.7 / 5.', timestamp: 'Yesterday · 09:15' },
];

type ShowcaseCard = {
  id: string;
  name: string;
  category: string;
  usage: string;
  lastUpdated: string;
};

const SHOWCASE: ShowcaseCard[] = [
  { id: 'sc1', name: 'AI Sales Dashboard', category: 'Analytics', usage: '1.2k weekly views', lastUpdated: 'Updated 2h ago' },
  { id: 'sc2', name: 'Growth Experiments', category: 'Operations', usage: '32 experiments running', lastUpdated: 'Updated 1h ago' },
  { id: 'sc3', name: 'Customer Segments', category: 'CRM', usage: '18 smart segments', lastUpdated: 'Updated 4h ago' },
  { id: 'sc4', name: 'Incident Command', category: 'Reliability', usage: 'SLA 99.98%', lastUpdated: 'Updated 30m ago' },
  { id: 'sc5', name: 'AI Prompt Library', category: 'Enablement', usage: '48 prompts curated', lastUpdated: 'Updated 3d ago' },
  { id: 'sc6', name: 'Design Tokens', category: 'Design System', usage: 'Synced with Figma', lastUpdated: 'Updated 1d ago' },
];

const VIDEO_SAMPLE: { uri: string } = {
  uri: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
};

const AUDIO_SAMPLE: { uri: string } = {
  uri: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
};

const TABLE_COLUMNS: DataTableColumn<UserRow>[] = [
  { key: 'name', title: 'Name', sortable: true, flex: 1.2 },
  { key: 'role', title: 'Role', sortable: true, flex: 1 },
  { key: 'location', title: 'Location', sortable: true, flex: 1 },
  {
    key: 'score',
    title: 'Health %',
    sortable: true,
    align: 'right',
    render: (row) => (
      <Text style={{ fontWeight: '600', color: row.score >= 85 ? '#22c55e' : row.score >= 75 ? '#facc15' : '#f87171' }}>
        {row.score}%
      </Text>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (row) => (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor:
            row.status === 'Active'
              ? 'rgba(34,197,94,0.15)'
              : row.status === 'Invited'
              ? 'rgba(99,102,241,0.15)'
              : 'rgba(148,163,184,0.2)',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color:
              row.status === 'Active' ? '#15803d' : row.status === 'Invited' ? '#4338ca' : '#475569',
          }}
        >
          {row.status}
        </Text>
      </View>
    ),
  },
  {
    key: 'lastActive',
    title: 'Last Active',
    align: 'right',
    render: (row) => <Text style={{ color: '#64748b' }}>{row.lastActive}</Text>,
  },
];

function UIComponentsExampleContent() {
  const { colors } = useTheme();
  const { showToast, dismissAll } = useToast();
  const isWeb = Platform.OS === 'web';
  const sectionGap = isWeb ? 16 : 12;
  const cardGap = isWeb ? 16 : 12;
  const outerPadding = isWeb ? 16 : 12;
  const bottomPadding = isWeb ? 40 : 24;
  const cardPadding = isWeb ? 16 : 12;

  const [progressValue, setProgressValue] = useState(62);
  const [overlaySpinnerVisible, setOverlaySpinnerVisible] = useState(false);
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [sortKey, setSortKey] = useState<string>('score');
  const [sortDirection, setSortDirection] = useState<DataTableSortDirection>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const [activity, setActivity] = useState(ACTIVITY);
  const [roleSelect, setRoleSelect] = useState<string | null>('product');
  const [multiTeams, setMultiTeams] = useState<string[]>(['ai', 'growth']);
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [rangeValue, setRangeValue] = useState<DateRangeValue>({ start: new Date(), end: new Date() });
  const [uploadedFiles, setUploadedFiles] = useState<SelectedFile[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [channels, setChannels] = useState<string[]>(['email']);
  const [contactPreference, setContactPreference] = useState('async');
  const [notes, setNotes] = useState('AI assistant onboarding looks great!');
  const [navPage, setNavPage] = useState(2);
  const [navPageSize, setNavPageSize] = useState(5);
  const [activeTab, setActiveTab] = useState('overview');

  const sortedUsers = useMemo(() => {
    const sorted = [...USER_ROWS];
    sorted.sort((a, b) => {
      const aValue = a[sortKey as keyof UserRow];
      const bValue = b[sortKey as keyof UserRow];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aText = String(aValue).toLowerCase();
      const bText = String(bValue).toLowerCase();
      if (aText < bText) return sortDirection === 'asc' ? -1 : 1;
      if (aText > bText) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortDirection, sortKey]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, pageSize, sortedUsers.length]);

  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [page, pageSize, sortedUsers]);

  const handleSortChange = useCallback((key: string, direction: DataTableSortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setActivity((prev) => [
        {
          id: `a${Date.now()}`,
          title: 'Realtime board update',
          summary: 'Product squad shipped new table filters.',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
      setRefreshing(false);
    }, 1200);
  }, []);

  const handleViewDeployLogs = useCallback(() => {
    showToast({
      title: 'Deployment logs opened',
      message: 'Switched to the release pipeline dashboard tab.',
      variant: 'info',
      duration: 3200,
    });
  }, [showToast]);

  const handleSuccessToast = useCallback(() => {
    showToast({
      title: 'Deploy complete',
      message: 'Expo build promoted to production in 48 seconds.',
      variant: 'success',
      duration: 4200,
    });
  }, [showToast]);

  const handleWarningToast = useCallback(() => {
    showToast({
      title: 'Storage threshold reached',
      message: 'Usage climbed to 82% of the current plan. Plan next upgrade.',
      variant: 'warning',
      duration: 5200,
    });
  }, [showToast]);

  const handleProgressAdvance = useCallback(() => {
    setProgressValue((prev) => {
      const next = prev + 18;
      if (next >= 100) {
        showToast({
          title: 'Artifacts synced',
          message: 'All evaluation assets are now up to date.',
          variant: 'info',
          duration: 3600,
        });
        return 28;
      }
      return Math.min(next, 100);
    });
  }, [showToast]);

  const handleOverlaySpinner = useCallback(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }
    setOverlaySpinnerVisible(true);
    overlayTimeoutRef.current = setTimeout(() => {
      setOverlaySpinnerVisible(false);
      showToast({
        title: 'Workspace refreshed',
        message: 'Latest analytics and usage metrics are available.',
        variant: 'default',
        duration: 3600,
      });
    }, 1800);
  }, [showToast]);

  const galleryItems = useMemo<MediaGalleryItem[]>(
    () => [
      {
        id: 'img-1',
        imageProps: {
          source: { uri: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=1080' },
          alt: 'Product analytics dashboard',
          contentFit: 'cover',
        },
        caption: 'Realtime conversion dashboard with AI powered alerts',
      },
      {
        id: 'img-2',
        imageProps: {
          source: { uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1080' },
          alt: 'Team collaboration around laptop',
          contentFit: 'cover',
        },
        caption: 'Growth squad reviewing launch readiness scorecards',
      },
      {
        id: 'img-3',
        imageProps: {
          source: { uri: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1080' },
          alt: 'AI assistant conversation preview',
          contentFit: 'cover',
        },
        caption: 'AI assistant summarizing incident response timeline',
      },
    ],
    [],
  );

  const breadcrumbTrail = useMemo(
    () => [
      { label: 'Home', onPress: () => {} },
      { label: 'Products', onPress: () => {} },
      { label: 'AI Suite', onPress: () => {} },
      { label: 'Assistant', isCurrent: true },
    ],
    [],
  );

  const stepItems: StepItem[] = [
    { id: 'plan', title: 'Plan', description: 'Define goals & success metrics', status: 'complete' },
    { id: 'design', title: 'Design', description: 'Create wireframes & UX flows', status: 'current' },
    { id: 'build', title: 'Build', description: 'Implement components & tests', status: 'upcoming' },
    { id: 'launch', title: 'Launch', description: 'Ship and monitor adoption', status: 'upcoming' },
  ];

  const tabs: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'metrics', label: 'Metrics', badge: 3 },
    { key: 'alerts', label: 'Alerts', badge: 1 },
    { key: 'history', label: 'History' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <AppHeader title="UI Components Library" subtitle="Data display components showcase" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: outerPadding, paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Table */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Data Table</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Sortable, pageable, filter friendly</Text>
            </View>

            <DataTable
              columns={TABLE_COLUMNS}
              data={pagedUsers}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              page={page}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20]}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
              totalItems={sortedUsers.length}
              filters={
                <View style={styles.filterRow}>
                  <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Team roster</Text>
                  <View style={styles.filterBadges}>
                    <View style={[styles.filterBadge, { backgroundColor: 'rgba(99,102,241,0.12)' }]}>
                      <Text style={[styles.filterBadgeLabel, { color: '#4338ca' }]}>AI</Text>
                    </View>
                    <View style={[styles.filterBadge, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                      <Text style={[styles.filterBadgeLabel, { color: '#0f766e' }]}>Product</Text>
                    </View>
                  </View>
                </View>
              }
            />
          </Card.Body>
        </Card>

        {/* Data List */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Data List</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Pull-to-refresh & infinite scroll ready</Text>
            </View>

            <DataList
              data={activity}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}> 
                  <View style={styles.listIndicator} />
                  <View style={styles.listContent}>
                    <Text style={[styles.listTitle, { color: colors.foreground }]}>{item.title}</Text>
                    <Text style={[styles.listSummary, { color: colors.mutedForeground }]}>{item.summary}</Text>
                    <Text style={[styles.listTimestamp, { color: colors.mutedForeground }]}>{item.timestamp}</Text>
                  </View>
                </View>
              )}
              loading={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={<EmptyState title="No activity" message="Try refreshing to fetch latest updates." />}
              contentContainerStyle={{ gap: isWeb ? 12 : 8, paddingHorizontal: isWeb ? 4 : 2 }}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </Card.Body>
        </Card>

        {/* Data Cards */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: cardGap, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Data Cards</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Composable info tiles with badges & actions</Text>
            </View>

            <View style={{ gap: cardGap }}>
              <DataCard
                title="AI Assistant Overview"
                subtitle="Realtime usage"
                description="Monitor adoption metrics across assistants, track satisfaction, and trigger playbooks with one tap."
                badges={[{ label: 'Live' }, { label: '+12% WoW', color: 'rgba(34,197,94,0.18)', textColor: '#166534' }]}
                metadata={[
                  { label: 'Active users', value: '4,812' },
                  { label: 'Avg response', value: '1.8s' },
                  { label: 'Satisfaction', value: '4.7 / 5' },
                ]}
                actions={
                  <>
                    <FormButton title="View dashboard" variant="primary" />
                    <FormButton title="Share" variant="secondary" />
                  </>
                }
              />

              <DataCard
                title="Experiment backlog"
                subtitle="Growth team"
                description="Prioritized hypotheses for the next sprint. Includes AI-personalized copy tests and onboarding flow updates."
                metadata={[
                  { label: 'Experiments', value: '12 ready' },
                  { label: 'Owners', value: 'Growth · Product' },
                ]}
                badges={[{ label: 'Needs review', color: 'rgba(250,204,21,0.18)', textColor: '#92400e' }]}
                footer={
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Last updated 6 hours ago by Zoey</Text>
                }
                condensed
              />
            </View>
          </Card.Body>
        </Card>

        {/* Data Grid */}
        <Card className="mb-6 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Data Grid</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Responsive cards, auto-fit columns</Text>
            </View>

            <DataGrid
              data={SHOWCASE}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DataCard
                  title={item.name}
                  subtitle={item.category}
                  description={item.usage}
                  metadata={[{ label: 'Status', value: item.lastUpdated }]}
                  condensed
                />
              )}
              minColumnWidth={isWeb ? 220 : 200}
              spacing={isWeb ? 16 : 12}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </Card.Body>
        </Card>

        {/* Navigation Components */}
        <Card className="mb-6 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Navigation Components</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Breadcrumbs, pagination, stepper, tabs</Text>
            </View>

            <View style={{ gap: cardGap }}>
              <Breadcrumbs items={breadcrumbTrail} />

              <NavigationPagination
                page={navPage}
                totalPages={5}
                totalItems={42}
                onPageChange={setNavPage}
                pageSize={navPageSize}
                onPageSizeChange={setNavPageSize}
                pageSizeOptions={[5, 10, 20]}
              />

              <Stepper steps={stepItems} />

              <Tabs
                tabs={tabs}
                value={activeTab}
                onChange={setActiveTab}
                scrollable
              />
              <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12 }}>
                Active tab: {activeTab}
              </Text>
            </View>
          </Card.Body>
        </Card>

      {/* Feedback & Status */}
      <Card className="mb-6 rounded-xl overflow-hidden">
        <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Feedback & Status</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Toasts, alerts, progress, badges, loaders</Text>
          </View>

          <Alert
            title="Deploy pipeline running"
            description="Release channel stable@v24.15 is rolling out. Monitoring metrics before unlocking production traffic."
            variant="info"
            dismissible
            actions={[
              { label: 'View logs', onPress: handleViewDeployLogs },
              { label: 'Pause deploy', onPress: handleWarningToast, variant: 'outline' },
            ]}
          />

          <View style={styles.badgeRow}>
            <Badge label="Realtime" leadingDot variant="accent" />
            <Badge label="Usage +12% WoW" variant="success" />
            <Badge label="3 alerts" variant="warning" />
            <Badge label="Beta cohort" variant="outline" />
          </View>

          <View style={styles.progressBlock}>
            <Progress
              label="Deploy progress"
              value={progressValue}
              helperText="Rolling out to global edge regions"
            />
            <FormButton title="Advance progress" variant="outline" size="small" onPress={handleProgressAdvance} />
            <Progress
              label="Model training queue"
              indeterminate
              variant="info"
              shape="circular"
              size="md"
              helperText="Awaiting GPU capacity"
              showValue={false}
            />
          </View>

          <View style={styles.feedbackButtonRow}>
            <FormButton title="Success toast" onPress={handleSuccessToast} size="small" variant="primary" />
            <FormButton title="Warning toast" onPress={handleWarningToast} size="small" variant="secondary" />
            <FormButton title="Clear toasts" onPress={dismissAll} size="small" variant="outline" />
            <FormButton title="Show overlay loader" onPress={handleOverlaySpinner} size="small" variant="outline" />
          </View>

          <View style={[styles.spinnerRow, { flexDirection: isWeb ? 'row' : 'column' }]}>
            <Spinner size="sm" label="Syncing insights" helperText="Refreshing usage data" />
            <Spinner size="lg" variant="muted" label="Preparing report" helperText="Keeping context while data streams" />
          </View>
        </Card.Body>
      </Card>

      {/* Media Components */}
      <Card className="mb-6 rounded-xl overflow-hidden">
        <Card.Body style={{ gap: sectionGap, padding: cardPadding }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Media Components</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Images, video, audio, gallery</Text>
          </View>

          <View style={{ gap: sectionGap }}>
            <MediaImage
              source={{ uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1920' }}
              alt="AI assistant hero illustration"
              aspectRatio={16 / 9}
              overlayContent={
                <View style={{ padding: 16 }}>
                  <Text style={{ color: '#f8fafc', fontWeight: '600' }}>AI Launch Week</Text>
                  <Text style={{ color: '#e2e8f0', fontSize: 12 }}>50+ experiments · 3 product squads</Text>
                </View>
              }
            />

            <MediaVideo
              source={VIDEO_SAMPLE}
              posterSource="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920"
              loop
              showControls={false}
              overlay={
                <View style={{ backgroundColor: 'rgba(15,23,42,0.35)', padding: 12, borderRadius: 16 }}>
                  <Text style={{ color: '#f8fafc', fontWeight: '600' }}>AI Assistant Walkthrough</Text>
                  <Text style={{ color: '#e2e8f0', fontSize: 12 }}>2m · Highlights new prompt orchestration</Text>
                </View>
              }
            />

            <MediaAudio
              source={AUDIO_SAMPLE}
              title="Daily Standup Recap"
              subtitle="AI summarised meeting • 3m"
              artworkUri="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600"
            />

            <MediaImageGallery
              items={galleryItems}
              initialIndex={galleryIndex}
              onChange={setGalleryIndex}
            />
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
              Viewing item {galleryIndex + 1} of {galleryItems.length}
            </Text>
          </View>
        </Card.Body>
      </Card>

        {/* Form Controls */}
        <Card className="mb-12 rounded-xl overflow-hidden">
          <Card.Body style={{ gap: isWeb ? 18 : 14, padding: cardPadding }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Form Controls</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Inputs, selectors, pickers, and toggles</Text>
            </View>

            <View style={{ gap: sectionGap }}>
              <FormInput
                label="Project name"
                placeholder="Enter project name"
                maxLength={40}
                showCharacterCount
                leadingAdornment={<IconSymbol name="sparkles" color={colors.accent} size={18} />}
                helperText="Displayed across analytics dashboards"
              />

              <FormSelect
                label="Primary owner"
                value={roleSelect}
                onChange={(next) => setRoleSelect(next as string)}
                options={[
                  { label: 'Product', value: 'product' },
                  { label: 'Growth', value: 'growth' },
                  { label: 'AI', value: 'ai' },
                ]}
                placeholder="Select team"
                helperText="Impacts default dashboards"
              />

              <FormSelect
                label="Collaborating teams"
                value={multiTeams}
                onChange={(next) => setMultiTeams(next as string[])}
                options={[
                  { label: 'AI Research', value: 'ai', description: 'LLM & evaluation' },
                  { label: 'Growth', value: 'growth', description: 'Experiments & lifecycle' },
                  { label: 'Design', value: 'design', description: 'Design system' },
                  { label: 'Customer Success', value: 'cs', description: 'Voice of customer' },
                ]}
                multiple
                placeholder="Choose collaborators"
                helperText="Select one or more teams"
              />

              <FormDatePicker
                label="Launch window"
                value={dateValue}
                onChange={setDateValue}
                helperText="Estimate the go-live date"
              />

              <FormDatePicker
                label="Experiment range"
                mode="datetime"
                range
                rangeValue={rangeValue}
                onRangeChange={setRangeValue}
                helperText="Plan the start & end of the cohort"
              />

              <FormFileUpload
                label="Supporting docs"
                value={uploadedFiles}
                onChange={setUploadedFiles}
                allowMultiple
                accept={['application/pdf', 'application/json']}
                helperText="Datasheets, prompts, experiment briefs"
              />

              <FormSwitch
                label="Send weekly digest"
                description="Deliver summary analytics every Monday"
                value={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />

              <FormCheckbox
                label="Notification channels"
                value={channels}
                onChange={setChannels}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Slack', value: 'slack' },
                  { label: 'PagerDuty', value: 'pagerduty', description: 'Critical alerts only' },
                ]}
              />

              <FormRadio
                label="Response preference"
                value={contactPreference}
                onChange={setContactPreference}
                options={[
                  { label: 'Async updates', value: 'async' },
                  { label: 'Office hours', value: 'office' },
                  { label: 'Real-time standup', value: 'realtime' },
                ]}
                direction="horizontal"
              />

              <FormTextarea
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                maxLength={200}
                showCharacterCount
                helperText="Share extra context for the rollout"
              />
            </View>
          </Card.Body>
        </Card>
      </ScrollView>
      {overlaySpinnerVisible ? (
        <Spinner
          overlay
          label="Refreshing workspace"
          helperText="Applying analytics and feature usage updates"
          variant="contrast"
          style={{ zIndex: 20 }}
        />
      ) : null}
    </View>
  );
}

export default function UIComponentsExampleScreen() {
  return (
    <ToastProvider>
      <UIComponentsExampleContent />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 0,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  filterBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  progressBlock: {
    gap: 12,
  },
  feedbackButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  spinnerRow: {
    alignItems: 'center',
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(148,163,184,0.12)',
  },
  listIndicator: {
    width: 4,
    borderRadius: 999,
    backgroundColor: '#6366f1',
  },
  listContent: {
    flex: 1,
    gap: 6,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  listSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
  listTimestamp: {
    fontSize: 12,
  },
});


