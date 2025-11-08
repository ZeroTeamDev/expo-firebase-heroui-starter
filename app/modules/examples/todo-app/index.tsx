/**
 * Todo App Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Full CRUD app example demonstrating database operations
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { FormCheckbox } from '@/components/forms/FormCheckbox';
import { useCollection, useMutation } from '@/hooks/use-firestore';
import { Spinner } from '@/components/feedback/Spinner';
import { EmptyState } from '@/components/data/EmptyState';
import { DataCard } from '@/components/data';
import { useToast } from '@/components/feedback/Toast';

interface Todo {
  id?: string;
  title: string;
  completed: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export default function TodoAppScreen() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Read todos collection
  const { data: todos, loading } = useCollection<Todo>('todos', {
    subscribe: true,
    filters: {
      orderBy: [['createdAt', 'desc']],
    },
  });

  // Create mutation
  const { mutate: createTodo, loading: creating } = useMutation();

  // Update mutation
  const { mutate: updateTodo, loading: updating } = useMutation();

  // Delete mutation
  const { mutate: deleteTodo, loading: deleting } = useMutation();

  const handleCreate = async () => {
    if (!newTodoTitle.trim()) {
      showToast({
        title: 'Error',
        message: 'Todo title cannot be empty',
        variant: 'danger',
      });
      return;
    }

    try {
      await createTodo('todos', {
        title: newTodoTitle.trim(),
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      setNewTodoTitle('');
      showToast({
        title: 'Success',
        message: 'Todo created successfully',
        variant: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.message || 'Failed to create todo',
        variant: 'danger',
      });
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    if (!todo.id) return;

    try {
      await updateTodo(`todos/${todo.id}`, {
        completed: !todo.completed,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.message || 'Failed to update todo',
        variant: 'danger',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(`todos/${id}`);
      showToast({
        title: 'Success',
        message: 'Todo deleted successfully',
        variant: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.message || 'Failed to delete todo',
        variant: 'danger',
      });
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id || null);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim()) return;

    try {
      await updateTodo(`todos/${editingId}`, {
        title: editTitle.trim(),
        updatedAt: Date.now(),
      });
      
      setEditingId(null);
      setEditTitle('');
      showToast({
        title: 'Success',
        message: 'Todo updated successfully',
        variant: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.message || 'Failed to update todo',
        variant: 'danger',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const completedCount = todos?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Todo App" subtitle="Full CRUD example" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Create Todo Form */}
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <FormInput
              label="New Todo"
              placeholder="Enter todo title..."
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              onSubmitEditing={handleCreate}
            />
            <FormButton
              title="Add Todo"
              onPress={handleCreate}
              loading={creating}
              disabled={!newTodoTitle.trim() || creating}
            />
          </Card.Body>
        </Card>

        {/* Statistics */}
        {totalCount > 0 && (
          <Card className="mb-4 rounded-xl">
            <Card.Body style={{ padding: 16 }}>
              <Text style={[styles.stats, { color: colors.foreground }]}>
                {completedCount} of {totalCount} completed
              </Text>
            </Card.Body>
          </Card>
        )}

        {/* Loading State */}
        {loading && <Spinner />}

        {/* Empty State */}
        {!loading && (!todos || todos.length === 0) && (
          <EmptyState message="No todos yet. Create your first todo above!" />
        )}

        {/* Todo List */}
        {todos && todos.length > 0 && (
          <View style={styles.todos}>
            {todos.map((todo) => (
              <Card key={todo.id} className="mb-3 rounded-xl">
                <Card.Body style={{ padding: 16, gap: 12 }}>
                  {editingId === todo.id ? (
                    // Edit Mode
                    <View style={styles.editMode}>
                      <FormInput
                        value={editTitle}
                        onChangeText={setEditTitle}
                        placeholder="Edit todo title..."
                        autoFocus
                      />
                      <View style={styles.editActions}>
                        <FormButton
                          title="Save"
                          onPress={handleSaveEdit}
                          loading={updating}
                          size="sm"
                        />
                        <FormButton
                          title="Cancel"
                          onPress={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        />
                      </View>
                    </View>
                  ) : (
                    // View Mode
                    <View style={styles.todoItem}>
                      <View style={styles.todoContent}>
                        <FormCheckbox
                          checked={todo.completed}
                          onPress={() => handleToggleComplete(todo)}
                          label={todo.title}
                          labelStyle={{
                            textDecorationLine: todo.completed ? 'line-through' : 'none',
                            opacity: todo.completed ? 0.6 : 1,
                          }}
                        />
                        {todo.createdAt && (
                          <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          onPress={() => handleStartEdit(todo)}
                          style={[styles.actionButton, { backgroundColor: colors.accent + '20' }]}
                        >
                          <Text style={[styles.actionText, { color: colors.accent }]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => todo.id && handleDelete(todo.id)}
                          style={[styles.actionButton, { backgroundColor: colors.danger + '20' }]}
                        >
                          <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Card.Body>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    padding: 16,
  },
  stats: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  todos: {
    marginTop: 8,
  },
  todoItem: {
    gap: 12,
  },
  todoContent: {
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 32,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editMode: {
    gap: 12,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

