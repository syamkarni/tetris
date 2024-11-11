import pygame
import random
import sys

WIDTH, HEIGHT = 300, 600
GRID_SIZE = 30
ROWS, COLS = HEIGHT // GRID_SIZE, WIDTH // GRID_SIZE
FPS = 5

SHAPES = {
    'I': [(0, 1), (1, 1), (2, 1), (3, 1)],
    'O': [(1, 1), (1, 2), (2, 1), (2, 2)],
    'T': [(1, 0), (0, 1), (1, 1), (2, 1)],
    'L': [(0, 1), (1, 1), (2, 1), (2, 2)],
    'J': [(0, 1), (1, 1), (2, 1), (0, 2)],
    'S': [(1, 1), (2, 1), (0, 2), (1, 2)],
    'Z': [(0, 1), (1, 1), (1, 2), (2, 2)]
}


pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Tetris with Parentheses Blocks")
clock = pygame.time.Clock()

font = pygame.font.Font(None, 36)


score = 0
high_score = 0


board = [[" "] * COLS for _ in range(ROWS)]  

class Piece:
    def __init__(self):
        self.shape = random.choice(list(SHAPES.values()))
        self.x, self.y = COLS // 2, 0

    def rotate(self):
        self.shape = [(-y, x) for x, y in self.shape]

    def can_move(self, dx, dy):
        for x, y in self.shape:
            new_x, new_y = self.x + x + dx, self.y + y + dy
            if new_x < 0 or new_x >= COLS or new_y >= ROWS or (new_y >= 0 and board[new_y][new_x] == "()"):
                return False
        return True

    def place(self):
        for x, y in self.shape:
            board[self.y + y][self.x + x] = "()"


def draw_board():
    screen.fill((0, 0, 0))
    for y, row in enumerate(board):
        for x, cell in enumerate(row):
            if cell == "()":
                text = font.render("()", True, (0, 255, 0))
                screen.blit(text, (x * GRID_SIZE, y * GRID_SIZE))

def clear_lines():
    global board, score, high_score
    new_board = [row for row in board if " " in row]
    lines_cleared = ROWS - len(new_board)
    score += lines_cleared * 100
    high_score = max(high_score, score)
    for _ in range(lines_cleared):
        new_board.insert(0, [" "] * COLS)
    board = new_board

def draw_score():
    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    high_score_text = font.render(f"High Score: {high_score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    screen.blit(high_score_text, (10, 40))


piece = Piece()
running = True
while running:
    clock.tick(FPS)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT and piece.can_move(-1, 0):
                piece.x -= 1
            elif event.key == pygame.K_RIGHT and piece.can_move(1, 0):
                piece.x += 1
            elif event.key == pygame.K_DOWN and piece.can_move(0, 1):
                piece.y += 1
            elif event.key == pygame.K_UP:
                piece.rotate()
                if not piece.can_move(0, 0):
                    piece.rotate()
                    piece.rotate()
                    piece.rotate()


    if piece.can_move(0, 1):
        piece.y += 1
    else:
        piece.place()
        clear_lines()
        piece = Piece()
        if not piece.can_move(0, 0):
            print("Game Over!")
            running = False


    draw_board()
    for x, y in piece.shape:
        text = font.render("()", True, (255, 0, 0))
        screen.blit(text, ((piece.x + x) * GRID_SIZE, (piece.y + y) * GRID_SIZE))
    draw_score()
    pygame.display.flip()

pygame.quit()
sys.exit()
