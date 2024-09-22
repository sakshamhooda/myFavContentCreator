import React, { useState, useEffect } from 'react';
import { PlusCircle, LayoutGrid, List, Search, Settings, Share, Clock, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ContentCreatorBoard = () => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Self Transformation', creators: [{ id: '1', name: 'The Power Of You' }], color: 'bg-orange-600' },
    { id: '2', name: 'Fitness', creators: [
      { id: '2', name: 'running channel #shorts' },
      { id: '3', name: 'Growth Matrix for P*nis' },
      { id: '4', name: 'YOGABODY' },
      { id: '5', name: 'Fitness' },
      { id: '6', name: 'Headfulness - Luke Horton' },
      { id: '7', name: 'Meditation Breathing Exercises Pranayam' }
    ], color: 'bg-red-600' },
    { id: '3', name: 'Entrepreneurship & Startups', creators: [
      { id: '8', name: 'Steve (Builder.io)' },
      { id: '9', name: 'Asli Engineering by Arpit Bhayani' }
    ], color: 'bg-pink-600' },
    { id: '4', name: 'Quant & FinTech', creators: [
      { id: '10', name: 'neurotrader' },
      { id: '11', name: 'Quantinsti Quantitative Learning' },
      { id: '12', name: 'Coding Jesus: Quantitative Trading' }
    ], color: 'bg-red-700' },
    { id: '5', name: 'DSA', creators: [], color: 'bg-blue-600' },
    { id: '6', name: 'Machine Learning', creators: [
      { id: '13', name: 'FutureMojo: NLP demystified' },
      { id: '14', name: 'ShusenWangEng DSA+ML AI' },
      { id: '15', name: 'Explore The Knowledge Complete course videos including AndrewNG' }
    ], color: 'bg-yellow-600' },
  ]);

  const [viewMode, setViewMode] = useState('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCreator, setIsAddingCreator] = useState(false);
  const [newCreator, setNewCreator] = useState({ name: '', category: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: 'bg-gray-600' });

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCategory = categories.find(cat => cat.id === source.droppableId);
      const destCategory = categories.find(cat => cat.id === destination.droppableId);
      const [removed] = sourceCategory.creators.splice(source.index, 1);
      destCategory.creators.splice(destination.index, 0, removed);
      setCategories([...categories]);
    } else {
      const category = categories.find(cat => cat.id === source.droppableId);
      const [removed] = category.creators.splice(source.index, 1);
      category.creators.splice(destination.index, 0, removed);
      setCategories([...categories]);
    }
  };

  const addCreator = () => {
    if (newCreator.name && newCreator.category) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === newCreator.category) {
          return {
            ...cat,
            creators: [...cat.creators, { id: Date.now().toString(), name: newCreator.name }]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewCreator({ name: '', category: '' });
      setIsAddingCreator(false);
    }
  };

  const addCategory = () => {
    if (newCategory.name) {
      setCategories([...categories, {
        id: Date.now().toString(),
        name: newCategory.name,
        creators: [],
        color: newCategory.color
      }]);
      setNewCategory({ name: '', color: 'bg-gray-600' });
      setIsAddingCategory(false);
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    creators: category.creators.filter(creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.creators.length > 0 || category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Favourite informative creators</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon"><Share className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={() => setViewMode('list')}><List className="h-4 w-4 mr-2" /> List view</Button>
          <Button variant="ghost" onClick={() => setViewMode('board')}><LayoutGrid className="h-4 w-4 mr-2" /> Board</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Search" 
            className="bg-gray-800" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddingCreator(true)}>New Creator</Button>
          <Button onClick={() => setIsAddingCategory(true)}>New Category</Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={viewMode === 'board' ? "grid grid-cols-6 gap-4" : "space-y-4"}>
          {filteredCategories.map((category) => (
            <Droppable droppableId={category.id} key={category.id}>
              {(provided) => (
                <Card className="bg-gray-800 border-gray-700" {...provided.droppableProps} ref={provided.innerRef}>
                  <CardContent className="p-4">
                    <div className={`flex items-center space-x-2 mb-4`}>
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <span className="text-sm text-gray-400">{category.creators.length}</span>
                    </div>
                    <div className="space-y-2">
                      {category.creators.map((creator, index) => (
                        <Draggable key={creator.id} draggableId={creator.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-700 p-2 rounded"
                            >
                              {creator.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isAddingCreator} onOpenChange={setIsAddingCreator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Creator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCreator.name}
                onChange={(e) => setNewCreator({ ...newCreator, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                value={newCreator.category}
                onChange={(e) => setNewCreator({ ...newCreator, category: e.target.value })}
                className="col-span-3"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addCreator}>Add Creator</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Name
              </Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryColor" className="text-right">
                Color
              </Label>
              <select
                id="categoryColor"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="col-span-3"
              >
                <option value="bg-red-600">Red</option>
                <option value="bg-blue-600">Blue</option>
                <option value="bg-green-600">Green</option>
                <option value="bg-yellow-600">Yellow</option>
                <option value="bg-purple-600">Purple</option>
                <option value="bg-pink-600">Pink</option>
                <option value="bg-indigo-600">Indigo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentCreatorBoard;