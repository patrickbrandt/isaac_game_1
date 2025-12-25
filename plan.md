# Isaac's Board Game - Web Version Plan

## Game Overview

A multiplayer math trivia game where players answer questions to earn coins, buy items from the shop, and race to be the first to reach 1000 points.

### Core Rules
- **Players**: 2-4 players, taking turns clockwise
- **Goal**: First player to reach 1000 points wins
- **Actions per Turn**: Each player gets **3 actions** per turn

### Actions (choose any combination, 3 total per turn)
1. **Answer a math question** - Earn 50 coins if correct
2. **Buy from the shop** - Spend coins on keys or tickets
3. **Open a chest** - Spend keys to earn points
4. **Spin the Wheel of Fortune** - Spend 1 ticket for a random reward

---

## Game Mechanics

### 1. Math Questions
- Players can use an action to answer a math question
- **Correct answer**: Earn 50 coins
- **Wrong answer**: Earn nothing (action is still used)
- Question types: Addition, subtraction, multiplication, division (age-appropriate)

### 2. Shop
Players can spend an action to buy:
| Item | Cost | Use |
|------|------|-----|
| Key | 50 coins | Opens chests |
| Ticket | 50 coins | Spins the Wheel of Fortune |

### 3. Chests
Three chests with increasing rewards (and key requirements):

| Chest | Keys Required | Reward |
|-------|---------------|--------|
| Chest 1 | 1 key | 50-100 points (random) |
| Chest 2 | 2 keys | 150-200 points (random) |
| Chest 3 | 3 keys | 250-300 points (random) |

### 4. Wheel of Fortune
- Costs 1 ticket to spin
- Roll a virtual 12-sided die
- Outcomes:

| Roll | Reward |
|------|--------|
| 1 | 100 points |
| 2 | 1 Key |
| 3 | Nothing |
| 4 | 50 points |
| 5 | 10 points |
| 6 | 50 points |
| 7 | 5 coins |
| 8 | 50 points |
| 9 | 500 points |
| 10 | 5 keys |
| 11 | 100 points |
| 12 | 3 tickets |

---

## Technical Implementation Plan

### Phase 1: Project Setup
- [ ] Initialize project with HTML, CSS, JavaScript
- [ ] Set up basic file structure
- [ ] Create responsive layout that works on desktop and tablet

### Phase 2: Game Board UI
- [ ] Design main game board layout matching Isaac's design
- [ ] Create the 3 chest areas at the top
- [ ] Build the Wheel of Fortune section with the 12 outcomes displayed
- [ ] Create the Shop interface
- [ ] Build player status areas (P1, P2, P3, P4) showing:
  - Current points
  - Coins
  - Keys
  - Tickets
- [ ] Add action counter (shows "Actions remaining: 3/2/1/0")

### Phase 3: Game Logic
- [ ] Implement game state management
  - Track current player turn
  - Track actions remaining (3 per turn)
  - Track each player's points, coins, keys, tickets
  - Detect win condition (1000 points)
- [ ] Build turn system (clockwise rotation)
- [ ] Implement action system (3 actions per turn)
- [ ] Create math question generator
  - Random math problems (add, subtract, multiply, divide)
  - Answer validation
  - Award 50 coins for correct answers

### Phase 4: Shop System
- [ ] Implement shop interface
- [ ] Buy key functionality (50 coins → 1 key, costs 1 action)
- [ ] Buy ticket functionality (50 coins → 1 ticket, costs 1 action)
- [ ] Validate player has enough coins

### Phase 5: Chest System
- [ ] Implement chest opening UI with animation
- [ ] Chest 1: Check for 1 key, award 50-100 random points
- [ ] Chest 2: Check for 2 keys, award 150-200 random points
- [ ] Chest 3: Check for 3 keys, award 250-300 random points
- [ ] Deduct keys when chest is opened
- [ ] Each chest opening costs 1 action

### Phase 6: Wheel of Fortune
- [ ] Create spinning wheel animation
- [ ] Implement 12-sided die roll logic
- [ ] Apply rewards based on roll result
- [ ] Deduct ticket when wheel is spun
- [ ] Spinning costs 1 action

### Phase 7: Game Flow & Polish
- [ ] Add game setup screen (select number of players, enter names)
- [ ] Add turn indicator (whose turn is it?)
- [ ] Add "End Turn" button (or auto-end when 3 actions used)
- [ ] Add win celebration screen
- [ ] Add "New Game" / "Play Again" functionality
- [ ] Add sound effects (optional)
- [ ] Mobile-friendly responsive design

---

## File Structure

```
isaac_boardgame/
├── index.html          # Main game page
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── game.js         # Core game logic & state
│   ├── questions.js    # Math question generator
│   ├── shop.js         # Shop functionality
│   ├── chests.js       # Chest system
│   ├── wheel.js        # Wheel of Fortune logic
│   └── ui.js           # UI updates & animations
└── assets/
    └── (images/sounds if needed)
```

---

## UI Mockup Layout

```
┌─────────────────────────────────────────────────────────┐
│                    ISAAC'S BOARD GAME                    │
│          Player 1's Turn    Actions Left: 3              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐    ┌─────────┐    ┌─────────┐              │
│  │ CHEST 1 │    │ CHEST 2 │    │ CHEST 3 │              │
│  │ (1 key) │    │ (2 keys)│    │ (3 keys)│              │
│  │ 50-100  │    │ 150-200 │    │ 250-300 │              │
│  │ [OPEN]  │    │ [OPEN]  │    │ [OPEN]  │              │
│  └─────────┘    └─────────┘    └─────────┘              │
├─────────────────────────────────────────────────────────┤
│                   WHEEL OF FORTUNE                       │
│  [1:100pts][2:Key][3:Nothing][4:50pts][5:10pts][6:50pts]│
│  [7:5coins][8:50pts][9:500pts][10:5keys][11:100pts][12:3tix]│
│                     [SPIN WHEEL]                         │
├─────────────────────────────────────────────────────────┤
│    SHOP: [Buy Key - 50 coins] [Buy Ticket - 50 coins]   │
├─────────────────────────────────────────────────────────┤
│              MATH QUESTION AREA                          │
│                  "What is 7 x 8?"                        │
│              [Answer Input] [Submit]                     │
├─────────────────────────────────────────────────────────┤
│                      [END TURN]                          │
├─────────────────────────────────────────────────────────┤
│  Player 1 ★    Player 2      Player 3      Player 4     │
│  Points: 0     Points: 0     Points: 0     Points: 0    │
│  Coins: 0      Coins: 0      Coins: 0      Coins: 0     │
│  Keys: 0       Keys: 0       Keys: 0       Keys: 0      │
│  Tickets: 0    Tickets: 0    Tickets: 0    Tickets: 0   │
└─────────────────────────────────────────────────────────┘
```

---

## Example Turn

**Player 1's turn (3 actions):**
1. Action 1: Answer math question "6 x 7 = ?" → Correct! +50 coins
2. Action 2: Buy a key from shop → -50 coins, +1 key
3. Action 3: Open Chest 1 → -1 key, +75 points (random 50-100)

Turn ends, Player 2's turn begins.

---

## Future Enhancements (Optional)
- Different difficulty levels for math questions
- Online multiplayer support
- Save/load game progress
- Leaderboard for fastest wins
- Custom themes/skins
- More question categories beyond math

---

## Credits

Game designed by Isaac (age 10)
Web version created with help from Claude Code
