from ortools.linear_solver import pywraplp
import random

def main():
    # Create the mip solver with the SCIP backend.
    solver = pywraplp.Solver.CreateSolver('SAT')
    if not solver:
        return

    infinity = solver.infinity()
    # number of recipes
    I = 10
    # number of meals
    K = 3
    x = [[solver.IntVar(0.0, infinity, 'x') for k in range(K)] for i in range(I)]
    # macro targets
    M = [100, 300, 400]
    J = len(M)
    # macro per recipe
    m = [[random.randint(0, 100) for j in range(J)] for i in range(I)]
    # 
    B = [[0.33, 0.33, 0.33] for k in range(K)]
    
    for k in range(K):
      solver.Add(solver.Sum([x[i][k] for i in range(I)]) <= 1)

    for i in range(I):
      solver.Add(solver.Sum([x[i][k] for k in range(K)]) <= 1)

    for k in range(K):
      for j in range(J):
        solver.Add(solver.Sum([x[i][k] * m[i][j] for i in range(I)]) <= B[k][j] * M[j])


    solver.Maximize(solver.Sum([x[i][k] * m[i][j] for i in range(I) for j in range(J) for k in range(K)]))
    
    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        print('Solution:')
        print('Objective value =', solver.Objective().Value())
        print('x =', [[o.solution_value() for o in l] for l in x])
    else:
        print('The problem does not have an optimal solution.')

    print('\nAdvanced usage:')
    print('Problem solved in %f milliseconds' % solver.wall_time())
    print('Problem solved in %d iterations' % solver.iterations())
    print('Problem solved in %d branch-and-bound nodes' % solver.nodes())

# if __name__ == "__main__":
main()